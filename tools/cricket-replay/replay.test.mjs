// Tests for replay.mjs, using synthetic_match.json (a made-up match, not Cricsheet data).
//
// Run them from this folder:
//
//     node --test
//
// The tests never use the internet.

import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, test } from 'node:test';
import { deflateRawSync } from 'node:zlib';

import {
  ReplayError,
  Replay,
  ballNumbers,
  downloadArchive,
  listMatches,
  liveState,
  loadMatch,
  readFromArchive,
  serve,
  startIndex,
} from './replay.mjs';

const HERE = import.meta.dirname;
const SCRIPT = join(HERE, 'replay.mjs');
const SYNTHETIC = JSON.parse(readFileSync(join(HERE, 'synthetic_match.json'), 'utf8'));
const freshMatch = () => loadMatch(SYNTHETIC, 'synthetic', 2.0);

/** A clock the test moves by hand, so no test has to wait. */
function fakeClock() {
  const clock = () => clock.now;
  clock.now = 100.0;
  return clock;
}

test('the match is read', () => {
  const match = freshMatch();
  assert.equal(match.deliveries.length, 23);
  assert.deepEqual(match.innings.map((i) => i.team), ['Pune Peacocks', 'Chennai Comets']);
  assert.deepEqual(match.meta.teams, ['Pune Peacocks', 'Chennai Comets']);
  assert.equal(match.meta.venue, 'Kit Test Ground, Pune');
  assert.equal(match.meta.date, '2026-11-01');
  assert.ok(match.meta.source.includes('Cricsheet') && match.meta.licence.includes('Attribution'));
});

test('a fresh start has zero balls', () => {
  const state = liveState(freshMatch(), 0);
  assert.equal(state.status, 'not started');
  assert.deepEqual(state.innings, [{ number: 1, team: 'Pune Peacocks', balls: [] }]);
});

test('balls are raw facts, grouped by innings', () => {
  const state = liveState(freshMatch(), 16); // 14 balls of innings 1 and 2 of innings 2
  assert.equal(state.status, 'live');
  assert.deepEqual(Object.keys(state).sort(), ['innings', 'match_id', 'status'], 'no totals at the top level');
  const [first, second] = state.innings;
  assert.deepEqual(Object.keys(first).sort(), ['balls', 'number', 'team'], 'no totals in an innings');
  assert.equal(first.balls.length, 14);
  assert.equal(second.balls.length, 2);
  assert.deepEqual(first.balls[1], {
    over: 0,
    ball: 2,
    batter: 'P Opener One',
    non_striker: 'P Opener Two',
    bowler: 'C Bowler One',
    runs: { batter: 4, extras: 0, total: 4 },
  });
});

test('extras, wickets and ball numbers', () => {
  const balls = liveState(freshMatch(), 14).innings[0].balls;
  const [wide, afterWide] = [balls[2], balls[3]];
  assert.deepEqual(wide.extras, { wides: 1 });
  assert.deepEqual([wide.over, wide.ball], [0, 3]);
  assert.deepEqual([afterWide.over, afterWide.ball], [0, 3], 'a wide does not move the ball number on');
  assert.ok(!('extras' in afterWide) && !('wicket' in afterWide));
  assert.deepEqual(balls[5].wicket, { player_out: 'P Opener Two', kind: 'caught', fielders: ['C Opener Two'] });
  assert.deepEqual(balls[10].wicket, { player_out: 'P Opener One', kind: 'bowled' });
  assert.equal(balls[9].runs.non_boundary, true);
  assert.deepEqual(balls[8].extras, { noballs: 1 });
});

test('a finished match', () => {
  const match = freshMatch();
  const state = liveState(match, 23);
  assert.equal(state.status, 'finished');
  assert.deepEqual(state.innings[1].balls[4].wicket, {
    player_out: 'C Opener One',
    kind: 'run out',
    fielders: ['P Batter Three'],
  });
  assert.deepEqual(liveState(match, 99), state, 'never more than the whole match');
});

test('ball numbers without actual_delivery (older Cricsheet files)', () => {
  const deliveries = [{}, { extras: { wides: 1 } }, {}, { extras: { noballs: 1 } }, {}, {}, {}, {}];
  assert.deepEqual(ballNumbers(deliveries), [1, 2, 2, 3, 3, 4, 5, 6]);
});

test('the super_over flag is passed on', () => {
  const data = structuredClone(SYNTHETIC);
  data.innings[1].super_over = true;
  const match = loadMatch(data, 'x');
  assert.deepEqual(match.innings[1], { number: 2, team: 'Chennai Comets', super_over: true });
});

test('the start point', () => {
  const match = freshMatch();
  assert.equal(startIndex(match, 1, 0), 0);
  assert.equal(startIndex(match, 1, 1), 7, 'over 1 starts after the 7 deliveries of over 0');
  assert.equal(startIndex(match, 2, 0), 14);
  assert.equal(startIndex(match, 2, 1), 21);
  assert.equal(startIndex(match, 1, 5), 14, 'an over past the end starts at the next innings');
  assert.throws(() => startIndex(match, 3, 0), ReplayError);
});

test('the clock adds one ball per interval', () => {
  const match = freshMatch();
  const clock = fakeClock();
  const feed = new Replay(match, 2.0, 0, clock);
  assert.equal(feed.shown(), 0);
  clock.now += 1.9;
  assert.equal(feed.shown(), 0);
  clock.now += 0.1;
  assert.equal(feed.shown(), 1);
  clock.now += 2 * 30;
  assert.equal(feed.shown(), 23);
  const later = new Replay(match, 0.5, 7, clock);
  clock.now += 1.0;
  assert.equal(later.shown(), 9);
});

describe('the HTTP server', () => {
  let server;
  let base;
  before(async () => {
    server = await serve(new Replay(freshMatch(), 0.05), '127.0.0.1', 0, true); // port 0: any free port
    base = `http://127.0.0.1:${server.address().port}`;
  });
  after(() => server.close());

  test('GET /live and GET /meta', async () => {
    let response = await fetch(`${base}/live`, { headers: { Origin: 'http://localhost:5173' } });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.ok(response.headers.get('content-type').startsWith('application/json'));
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal((await response.json()).match_id, 'synthetic');
    response = await fetch(`${base}/meta`, { headers: { Origin: 'https://asha.github.io' } });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.deepEqual((await response.json()).teams, ['Pune Peacocks', 'Chennai Comets']);
  });

  test('the preflight and private-network access', async () => {
    let response = await fetch(`${base}/live`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://asha.github.io',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Private-Network': 'true',
      },
    });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.equal(response.headers.get('access-control-allow-private-network'), 'true');
    response = await fetch(`${base}/live`, { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173' } });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-private-network'), null);
  });

  test('an unknown page gives 404', async () => {
    const response = await fetch(`${base}/score`);
    assert.equal(response.status, 404);
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.deepEqual((await response.json()).endpoints, ['/live', '/meta']);
  });

  test('balls arrive over time', async () => {
    const count = (state) => state.innings.reduce((sum, i) => sum + i.balls.length, 0);
    const first = await (await fetch(`${base}/live`)).json();
    assert.ok(['not started', 'live'].includes(first.status));
    await new Promise((resolve) => setTimeout(resolve, 300));
    const later = await (await fetch(`${base}/live`)).json();
    assert.ok(count(later) > count(first));
  });

  test('a second server on the same port says the port is busy', async () => {
    const port = server.address().port;
    await assert.rejects(serve(new Replay(freshMatch()), '127.0.0.1', port, true), /port \d+ is busy/);
  });

  test('a port held by another program on all addresses is busy too', async () => {
    const other = createServer((request, response) => response.end('another program'));
    await new Promise((resolve) => other.listen(0, resolve));
    const port = other.address().port;
    try {
      await assert.rejects(serve(new Replay(freshMatch()), '127.0.0.1', port, true), /port \d+ is busy/);
    } finally {
      other.close();
    }
  });
});

// ---------------------------------------------------------------------------
// A small zip shaped like Cricsheet's IPL archive, holding the synthetic match as 999001
// ---------------------------------------------------------------------------

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let k = 0; k < 8; k += 1) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** Write a zip file. Each file is [name, text, method]: method 0 stores it, 8 deflates it. */
function writeZip(path, files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const [name, text, method] of files) {
    const data = Buffer.from(text, 'utf8');
    const packed = method === 8 ? deflateRawSync(data) : data;
    const nameBytes = Buffer.from(name, 'utf8');
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(method, 8);
    local.writeUInt32LE(crc32(data), 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(method, 10);
    central.writeUInt32LE(crc32(data), 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, nameBytes, packed);
    centrals.push(central, nameBytes);
    offset += local.length + nameBytes.length + packed.length;
  }
  const directory = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  writeFileSync(path, Buffer.concat([...locals, directory, end]));
}

describe('the IPL archive', () => {
  let folder;
  let archive;
  before(() => {
    folder = mkdtempSync(join(tmpdir(), 'replay-test-'));
    archive = join(folder, 'ipl_json.zip');
    const readme =
      'The matches contained in this zip archive are listed below.\n\n' +
      '2026-11-01 - club - IPL - male - 999001 - Pune Peacocks vs Chennai Comets\n' +
      '2025-04-02 - club - IPL - male - 999000 - Kolkata Kites vs Mumbai Mangoes\n';
    writeZip(archive, [
      ['README.txt', readme, 0],
      ['999001.json', JSON.stringify(SYNTHETIC), 8],
    ]);
  });
  after(() => rmSync(folder, { recursive: true, force: true }));

  test('list and read', () => {
    assert.deepEqual(listMatches(archive), [
      ['999001', '2026-11-01', 'Pune Peacocks vs Chennai Comets'],
      ['999000', '2025-04-02', 'Kolkata Kites vs Mumbai Mangoes'],
    ]);
    assert.deepEqual(listMatches(archive, '2025').map((m) => m[0]), ['999000']);
    assert.deepEqual(listMatches(archive, null, 'peacocks').map((m) => m[0]), ['999001']);
    assert.equal(readFromArchive(archive, '999001').info.venue, 'Kit Test Ground, Pune');
    assert.throws(() => readFromArchive(archive, '123'), /not in the IPL archive/);
    assert.throws(() => readFromArchive(archive, '../etc/passwd'), /is a number/);
  });

  test('a broken zip gives a clear error', () => {
    const broken = join(folder, 'broken.zip');
    writeFileSync(broken, readFileSync(archive).subarray(0, 100));
    assert.throws(() => readFromArchive(broken, '999001'), /not a complete zip file/);
  });

  test('a cached archive is not downloaded again', async () => {
    const noInternet = () => {
      throw new Error('the test tried to use the internet');
    };
    assert.equal(await downloadArchive(folder, false, noInternet), archive);
  });

  test('the command line lists matches', () => {
    const output = execFileSync(process.execPath, [SCRIPT, '--list', '--cache-dir', folder], { encoding: 'utf8' });
    assert.ok(output.includes('999001  2026-11-01  Pune Peacocks vs Chennai Comets'));
  });

  test('the command line reports a wrong id', () => {
    const result = spawnSync(process.execPath, [SCRIPT, '--match', '42', '--cache-dir', folder], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.ok(result.stderr.includes('not in the IPL archive'));
  });
});
