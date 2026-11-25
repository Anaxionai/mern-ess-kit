#!/usr/bin/env node
// Replay one IPL match from Cricsheet, ball by ball, as if it were live.
//
// Match Centre (P3) reads this feed. Start it in Git Bash and leave the terminal open:
//
//     node replay.mjs                     # the default match (see DEFAULT_MATCH below)
//     node replay.mjs --match 1529297     # any match id from the IPL archive (find ids with --list)
//     node replay.mjs --file match.json   # one Cricsheet JSON match file that you downloaded
//
// Then open http://localhost:8765/live and http://localhost:8765/meta in a browser.
// A new ball appears every 2 seconds; change that with --speed.
//
// The data comes from Cricsheet (https://cricsheet.org) under the Open Data
// Commons Attribution License 1.0. A public page that shows it must say so.
//
// Only Node's built-in modules are used, so there is nothing to install.

import { createServer } from 'node:http';
import { connect } from 'node:net';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, extname, join } from 'node:path';
import { parseArgs } from 'node:util';
import { inflateRawSync } from 'node:zlib';

export const ARCHIVE_URL = 'https://cricsheet.org/downloads/ipl_json.zip';
export const DEFAULT_MATCH = '1527687'; // Gujarat Titans v Delhi Capitals, 8 April 2026, won by 1 run
export const DEFAULT_PORT = 8765;
export const DEFAULT_CACHE = join(homedir(), '.cache', 'js-cricket-replay');
export const SOURCE = 'Cricsheet (https://cricsheet.org)';
export const LICENCE =
  'Open Data Commons Attribution License 1.0 (https://opendatacommons.org/licenses/by/1-0/)';

/** A problem the user can fix, such as a wrong match id. main() prints it without a stack trace. */
export class ReplayError extends Error {}

// ---------------------------------------------------------------------------
// Reading a Cricsheet match
// ---------------------------------------------------------------------------

/**
 * Turn one Cricsheet delivery into the ball that the feed serves.
 * The ball keeps Cricsheet's own facts only. Totals, scorecards and
 * commentary are left for Match Centre to work out.
 */
export function makeBall(delivery, over, ballNumber) {
  const runs = delivery.runs;
  const ball = {
    over, // counts from 0, as in Cricsheet: ball 0.1 is the first ball of the innings
    ball: ballNumber, // 1 to 6; a wide or no-ball does not move it on, so the next ball repeats it
    batter: delivery.batter,
    non_striker: delivery.non_striker,
    bowler: delivery.bowler,
    runs: { batter: runs.batter, extras: runs.extras, total: runs.total },
  };
  if (runs.non_boundary) ball.runs.non_boundary = true; // 4 runs that were run, not a boundary
  if (delivery.extras && Object.keys(delivery.extras).length > 0) {
    ball.extras = { ...delivery.extras }; // only the kinds that happened, such as {"wides": 1}
  }
  if (delivery.wickets && delivery.wickets.length > 0) {
    const first = delivery.wickets[0]; // no IPL delivery has two wickets
    const wicket = { player_out: first.player_out, kind: first.kind };
    const fielders = (first.fielders ?? []).filter((f) => 'name' in f).map((f) => f.name);
    if (fielders.length > 0) wicket.fielders = fielders;
    ball.wicket = wicket;
  }
  return ball;
}

/**
 * The ball number (1 to 6) of each delivery in one over.
 * Cricsheet 1.3.0 writes it in "actual_delivery", such as "3.2". Older files
 * do not have it, so we count: wides and no-balls are not legal balls, so they
 * share the number of the next legal ball.
 */
export function ballNumbers(deliveries) {
  const numbers = [];
  let legal = 0;
  for (const delivery of deliveries) {
    const actual = delivery.actual_delivery;
    if (actual && String(actual).includes('.')) {
      numbers.push(Number.parseInt(String(actual).split('.')[1], 10));
    } else {
      numbers.push(legal + 1);
    }
    const extras = delivery.extras ?? {};
    if (!('wides' in extras) && !('noballs' in extras)) legal += 1;
  }
  return numbers;
}

/** Read a Cricsheet match (already parsed from JSON) into a match object. */
export function loadMatch(data, matchId, secondsPerBall = 2.0) {
  const info = data.info;
  const event = info.event ?? {};
  const meta = {
    match_id: matchId,
    teams: info.teams,
    venue: info.venue ?? null,
    city: info.city ?? null,
    date: info.dates[0],
    event: event.name ?? null,
    match_number: event.match_number ?? null,
    stage: event.stage ?? null,
    season: String(info.season ?? ''),
    toss: info.toss ?? null,
    overs: info.overs ?? null,
    balls_per_over: info.balls_per_over ?? 6,
    players: info.players ?? {},
    seconds_per_ball: secondsPerBall,
    source: SOURCE,
    licence: LICENCE,
  };
  const match = { matchId, meta, innings: [], deliveries: [] };
  (data.innings ?? []).forEach((innings, index) => {
    const head = { number: index + 1, team: innings.team };
    if (innings.super_over) head.super_over = true;
    match.innings.push(head);
    for (const over of innings.overs ?? []) {
      const numbers = ballNumbers(over.deliveries);
      over.deliveries.forEach((delivery, i) => {
        match.deliveries.push([index, makeBall(delivery, over.over, numbers[i])]);
      });
    }
  });
  return match;
}

/**
 * How many deliveries come before the chosen start point.
 * fromOver=15 starts with 15 overs of that innings already bowled, so the
 * next ball is 15.1. It counts the overs of one innings, from 0.
 */
export function startIndex(match, inningsNumber = 1, fromOver = 0) {
  const count = match.innings.length;
  if (!(inningsNumber >= 1 && inningsNumber <= Math.max(1, count))) {
    throw new ReplayError(`this match has ${count} innings, so --innings must be 1 to ${count}`);
  }
  for (let position = 0; position < match.deliveries.length; position += 1) {
    const [index, ball] = match.deliveries[position];
    if (index === inningsNumber - 1 && ball.over >= fromOver) return position;
    if (index > inningsNumber - 1) return position;
  }
  return match.deliveries.length;
}

// ---------------------------------------------------------------------------
// The replay clock and the two answers
// ---------------------------------------------------------------------------

/** Shows one more delivery every `secondsPerBall` seconds, from a start point. */
export class Replay {
  constructor(match, secondsPerBall = 2.0, startCount = 0, clock = () => performance.now() / 1000) {
    this.match = match;
    this.secondsPerBall = secondsPerBall;
    this.startCount = startCount;
    this.clock = clock;
    this.startedAt = clock();
  }

  /** How many deliveries have been bowled so far. */
  shown() {
    // The small extra stops 1.9 + 0.1 from counting as 1.9999999 seconds.
    const ticks = Math.floor((this.clock() - this.startedAt) / this.secondsPerBall + 1e-9);
    return Math.min(this.match.deliveries.length, this.startCount + ticks);
  }

  live() {
    return liveState(this.match, this.shown());
  }

  meta() {
    return this.match.meta;
  }
}

/**
 * The answer to GET /live: the balls so far, grouped by innings.
 * The first innings is always there, with an empty "balls" list before the
 * first ball. A later innings appears with its first ball.
 */
export function liveState(match, shown) {
  const total = match.deliveries.length;
  const status = shown === 0 ? 'not started' : shown >= total ? 'finished' : 'live';
  const grouped = new Map();
  for (const [index, ball] of match.deliveries.slice(0, shown)) {
    if (!grouped.has(index)) grouped.set(index, []);
    grouped.get(index).push(ball);
  }
  const innings = [];
  match.innings.forEach((head, index) => {
    if (grouped.has(index) || index === 0) innings.push({ ...head, balls: grouped.get(index) ?? [] });
  });
  return { match_id: match.matchId, status, innings };
}

// ---------------------------------------------------------------------------
// The web server
// ---------------------------------------------------------------------------

function sendJson(request, response, status, body) {
  const data = Buffer.from(JSON.stringify(body, null, 1), 'utf8');
  response.writeHead(status, {
    // Any web page may read this feed: it is public match data, on your own computer only.
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': String(data.length),
    'Cache-Control': 'no-store', // always ask again: the match changes every ball
  });
  response.end(request.method === 'HEAD' ? undefined : data);
}

/** The request handler: GET /live, GET /meta, GET /, and the browser's OPTIONS preflight. */
export function makeHandler(replay, quiet = false) {
  return (request, response) => {
    if (!quiet) {
      response.on('finish', () => {
        const time = new Date().toTimeString().slice(0, 8);
        process.stderr.write(`${time} ${request.method} ${request.url} ${response.statusCode}\n`);
      });
    }
    if (request.method === 'OPTIONS') {
      // A browser sends OPTIONS (a "preflight") before a cross-origin request with extra headers.
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': request.headers['access-control-request-headers'] || '*',
        'Access-Control-Max-Age': '600',
        'Content-Length': '0',
      };
      if ((request.headers['access-control-request-private-network'] ?? '').toLowerCase() === 'true') {
        // Chrome asks this when a public page (such as your github.io site) calls localhost.
        headers['Access-Control-Allow-Private-Network'] = 'true';
      }
      response.writeHead(204, headers);
      response.end();
      return;
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      sendJson(request, response, 405, { error: `${request.method} is not allowed`, endpoints: ['/live', '/meta'] });
      return;
    }
    const path = (request.url ?? '/').split('?')[0].replace(/\/+$/, '') || '/';
    if (path === '/live') sendJson(request, response, 200, replay.live());
    else if (path === '/meta') sendJson(request, response, 200, replay.meta());
    else if (path === '/') {
      sendJson(request, response, 200, {
        endpoints: ['/live', '/meta'],
        match_id: replay.match.matchId,
        source: SOURCE,
        licence: LICENCE,
      });
    } else sendJson(request, response, 404, { error: `no page at ${path}`, endpoints: ['/live', '/meta'] });
  };
}

/** Does any program answer on this port of this computer, over IPv4 or IPv6? */
export function portAnswers(port, timeoutMs = 500) {
  const tryHost = (host) =>
    new Promise((resolve) => {
      const socket = connect({ host, port });
      const done = (answered) => {
        socket.destroy();
        resolve(answered);
      };
      socket.setTimeout(timeoutMs, () => done(false));
      socket.once('connect', () => done(true));
      socket.once('error', () => done(false));
    });
  return Promise.all([tryHost('127.0.0.1'), tryHost('::1')]).then((answers) => answers.includes(true));
}

function busyError(port, code) {
  return new ReplayError(
    `port ${port} is busy (${code}). Another replay server or another program (such as a Docker container) ` +
      `uses it: stop it, or add --port ${port + 1} and use that port in your app`,
  );
}

/** Start the server. Resolves with the server once it listens; port 0 picks any free port. */
export async function serve(replay, host, port, quiet = false) {
  // On Windows, listening on 127.0.0.1 succeeds even when another program (a Docker
  // container, for example) holds the same port on 0.0.0.0 or IPv6. The browser and curl
  // would then reach that program at localhost, so check first that nothing answers.
  if (port !== 0 && (await portAnswers(port))) throw busyError(port, 'in use');
  return new Promise((resolve, reject) => {
    const server = createServer(makeHandler(replay, quiet));
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE' || error.code === 'EACCES') reject(busyError(port, error.code));
      else reject(error);
    });
    // exclusive: on Windows a second server must not share a busy port.
    server.listen({ host, port, exclusive: true }, () => resolve(server));
  });
}

// ---------------------------------------------------------------------------
// Getting the match from Cricsheet's IPL archive
// ---------------------------------------------------------------------------

/** Download Cricsheet's IPL archive once, and keep it in the cache folder. */
export async function downloadArchive(cacheDir, refresh = false, fetchImpl = globalThis.fetch) {
  const path = join(cacheDir, 'ipl_json.zip');
  if (existsSync(path) && !refresh) return path;
  mkdirSync(cacheDir, { recursive: true });
  console.log(`Downloading the IPL archive (about 5 MB) from ${ARCHIVE_URL} ...`);
  let data;
  try {
    const response = await fetchImpl(ARCHIVE_URL, {
      headers: { 'User-Agent': 'course-kit cricket-replay' },
      signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    data = Buffer.from(await response.arrayBuffer());
  } catch (error) {
    throw new ReplayError(
      `could not download ${ARCHIVE_URL} (${error.message}). Check your internet connection, ` +
        `or download it in your browser and save it as ${path}`,
    );
  }
  const partial = `${path}.part`;
  writeFileSync(partial, data);
  renameSync(partial, path); // only a complete download gets the real name
  console.log(`Saved it as ${path}`);
  return path;
}

/**
 * A small zip reader: the names in the archive and a function that reads one file.
 * Cricsheet's archive uses the two common methods, 0 (stored) and 8 (deflate).
 */
export function openZip(zipPath) {
  const buffer = readFileSync(zipPath);
  const bad = () => new ReplayError(`${zipPath} is not a complete zip file. Download it again with --refresh`);
  // The "end of central directory" record is in the last 64 KB of the file.
  let end = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65_557); i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      end = i;
      break;
    }
  }
  if (end < 0) throw bad();
  const count = buffer.readUInt16LE(end + 10);
  let offset = buffer.readUInt32LE(end + 16);
  const entries = new Map();
  for (let n = 0; n < count; n += 1) {
    if (offset + 46 > buffer.length || buffer.readUInt32LE(offset) !== 0x02014b50) throw bad();
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString('utf8', offset + 46, offset + 46 + nameLength);
    entries.set(name, { method, compressedSize, localOffset });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  function read(name) {
    const entry = entries.get(name);
    if (!entry) return null;
    const local = entry.localOffset;
    if (buffer.readUInt32LE(local) !== 0x04034b50) throw bad();
    const start = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
    const raw = buffer.subarray(start, start + entry.compressedSize);
    try {
      if (entry.method === 0) return Buffer.from(raw);
      if (entry.method === 8) return inflateRawSync(raw);
    } catch {
      throw bad();
    }
    throw new ReplayError(`${name} in ${zipPath} uses zip method ${entry.method}, which this script cannot read`);
  }
  return { names: [...entries.keys()], read };
}

/** Read one match's JSON from the archive by its id, such as 1527687. */
export function readFromArchive(zipPath, matchId) {
  if (!/^\d+$/.test(matchId)) {
    throw new ReplayError(`a match id is a number, such as ${DEFAULT_MATCH}, not '${matchId}'`);
  }
  const data = openZip(zipPath).read(`${matchId}.json`);
  if (data === null) {
    throw new ReplayError(`match ${matchId} is not in the IPL archive. Find a match id with --list`);
  }
  return JSON.parse(data.toString('utf8'));
}

/**
 * The [match id, date, teams] of every match in the archive, newest first.
 * The archive's README.txt has one line per match, for example:
 * 2026-04-08 - club - IPL - male - 1527687 - Gujarat Titans vs Delhi Capitals
 */
export function listMatches(zipPath, season = null, team = null) {
  const readme = openZip(zipPath).read('README.txt');
  if (readme === null) throw new ReplayError(`${zipPath} has no README.txt. Download it again with --refresh`);
  const found = [];
  for (const line of readme.toString('utf8').split(/\r?\n/)) {
    const parts = line.split(' - ');
    if (parts.length < 6) continue;
    const date = parts[0];
    const matchId = parts[4].trim();
    const teams = parts.slice(5).join(' - ').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d+$/.test(matchId)) continue;
    if (season && !date.startsWith(season)) continue;
    if (team && !teams.toLowerCase().includes(team.toLowerCase())) continue;
    found.push([matchId, date, teams]);
  }
  return found;
}

// ---------------------------------------------------------------------------
// The command line
// ---------------------------------------------------------------------------

const HELP = `Replay an IPL match from Cricsheet ball by ball on http://localhost:8765/live and /meta.

Usage: node replay.mjs [options]

  --match ID         a match id from the IPL archive (default ${DEFAULT_MATCH})
  --file PATH        a Cricsheet JSON file of one match
  --list             list the match ids in the IPL archive, then stop
  --season YEAR      with --list: only this season, such as 2026
  --team TEXT        with --list: only matches of a team whose name contains this text
  --speed SECONDS    seconds between two balls (default 2; 0.5 is faster, 5 is slower)
  --innings N        the innings to start in (default 1)
  --from-over N      start with this many overs of that innings already bowled (default 0)
  --port N           the port to serve on (default ${DEFAULT_PORT})
  --host ADDRESS     the address to listen on (default 127.0.0.1: this computer only)
  --cache-dir PATH   where to keep the downloaded archive
  --refresh          download the IPL archive again
  --quiet            do not print a line for every request
  --help             show this help`;

export function parseCommandLine(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      match: { type: 'string' },
      file: { type: 'string' },
      list: { type: 'boolean', default: false },
      season: { type: 'string' },
      team: { type: 'string' },
      speed: { type: 'string', default: '2' },
      innings: { type: 'string', default: '1' },
      'from-over': { type: 'string', default: '0' },
      port: { type: 'string', default: String(DEFAULT_PORT) },
      host: { type: 'string', default: '127.0.0.1' },
      'cache-dir': { type: 'string', default: DEFAULT_CACHE },
      refresh: { type: 'boolean', default: false },
      quiet: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  });
  const args = {
    match: values.match ?? null,
    file: values.file ?? null,
    list: values.list,
    season: values.season ?? null,
    team: values.team ?? null,
    speed: Number(values.speed),
    innings: Number(values.innings),
    fromOver: Number(values['from-over']),
    port: Number(values.port),
    host: values.host,
    cacheDir: values['cache-dir'],
    refresh: values.refresh,
    quiet: values.quiet,
    help: values.help,
  };
  if ([args.match, args.file, args.list || null].filter((v) => v !== null).length > 1) {
    throw new ReplayError('use only one of --match, --file and --list');
  }
  if (!(args.speed >= 0.05)) throw new ReplayError('--speed must be at least 0.05 seconds');
  if (!Number.isInteger(args.innings)) throw new ReplayError('--innings must be a whole number');
  if (!Number.isInteger(args.fromOver) || args.fromOver < 0) throw new ReplayError('--from-over must be 0 or more');
  if (!Number.isInteger(args.port) || args.port < 0 || args.port > 65535) {
    throw new ReplayError('--port must be a number from 0 to 65535');
  }
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  let args;
  let match;
  let replay;
  let server;
  try {
    args = parseCommandLine(argv);
    if (args.help) {
      console.log(HELP);
      return 0;
    }
    if (args.list) {
      const zipPath = await downloadArchive(args.cacheDir, args.refresh);
      for (const [matchId, date, teams] of listMatches(zipPath, args.season, args.team)) {
        console.log(`${matchId}  ${date}  ${teams}`);
      }
      return 0;
    }
    let data;
    let matchId;
    if (args.file) {
      if (!existsSync(args.file)) throw new ReplayError(`there is no file ${args.file}`);
      data = JSON.parse(readFileSync(args.file, 'utf8'));
      matchId = basename(args.file, extname(args.file));
    } else {
      matchId = args.match ?? DEFAULT_MATCH;
      data = readFromArchive(await downloadArchive(args.cacheDir, args.refresh), matchId);
    }
    match = loadMatch(data, matchId, args.speed);
    replay = new Replay(match, args.speed, startIndex(match, args.innings, args.fromOver));
    server = await serve(replay, args.host, args.port, args.quiet);
  } catch (error) {
    if (error instanceof ReplayError || error.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION') {
      console.error(`Error: ${error.message}`);
      return 1;
    }
    throw error;
  }

  const meta = match.meta;
  const left = match.deliveries.length - replay.startCount;
  const port = server.address().port;
  console.log(`Replaying match ${match.matchId}: ${meta.teams.join(' v ')}, ${meta.venue}, ${meta.date}`);
  const minutes = Math.max(1, Math.round((left * args.speed) / 60));
  console.log(`One ball every ${args.speed} seconds: ${left} deliveries, about ${minutes} minute${minutes === 1 ? '' : 's'}.`);
  console.log(`Feed: http://localhost:${port}/live   Match details: http://localhost:${port}/meta`);
  console.log(`Data: ${SOURCE}, ${LICENCE}.`);
  console.log('Press Ctrl+C to stop.');
  await new Promise((resolve) => {
    process.once('SIGINT', () => {
      console.log('\nStopped.');
      server.close();
      resolve();
    });
  });
  return 0;
}

// Run main() only when this file is started with `node replay.mjs`, not when a test imports it.
if (import.meta.main) {
  process.exitCode = await main();
}
