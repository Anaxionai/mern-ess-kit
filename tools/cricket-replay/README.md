# Cricket replay: a live IPL feed for Match Centre (P3)

`replay.mjs` replays one real IPL match, ball by ball, as if it were live.
Match Centre, your P3 app (week 6), reads it from `http://localhost:8765`.
A new ball arrives every 2 seconds, so a whole match takes about 8 minutes.

The ball-by-ball data comes from **[Cricsheet](https://cricsheet.org)**. The script uses only Node's built-in modules, so there is nothing to install: the Node.js you set up in week 1 runs it.

## Start it

Run this in Git Bash, and leave the terminal open while you work:

```bash
cd ~/mern-ess-kit/tools/cricket-replay
node replay.mjs
```

The first time, the script downloads Cricsheet's IPL archive (about 5 MB) and keeps it in `~/.cache/js-cricket-replay/`.
After that, it starts at once and works without the internet. You then see:

```text
Replaying match 1527687: Gujarat Titans v Delhi Capitals, Arun Jaitley Stadium, 2026-04-08
One ball every 2 seconds: 254 deliveries, about 8 minutes.
Feed: http://localhost:8765/live   Match details: http://localhost:8765/meta
```

Open `http://localhost:8765/live` in your browser, or run `curl http://localhost:8765/live` in a second Git Bash window.
To stop the replay, press **Ctrl+C** in its terminal. To start the match again from the first ball, start the script again.

The default match is Gujarat Titans against Delhi Capitals, 8 April 2026. Gujarat Titans won it by 1 run.

## Options

| Option | What it does | Example |
|---|---|---|
| `--match ID` | Replay another match from the IPL archive | `node replay.mjs --match 1529297` |
| `--file PATH` | Replay one Cricsheet JSON match file that you saved | `node replay.mjs --file 1529297.json` |
| `--list` | List the match ids, newest first, then stop. Add `--season` or `--team` to filter. | `node replay.mjs --list --season 2026 --team Mumbai` |
| `--speed SECONDS` | Seconds between two balls (default 2). A smaller number is faster. | `node replay.mjs --speed 0.5` |
| `--from-over N` | Start with N overs of the innings already bowled | `node replay.mjs --from-over 15` |
| `--innings N` | Start in innings N (use it with `--from-over`) | `node replay.mjs --innings 2 --from-over 15` |
| `--port N` | Serve on another port (default 8765) | `node replay.mjs --port 8766` |
| `--quiet` | Do not print a line for each request | `node replay.mjs --quiet` |
| `--refresh` | Download the IPL archive again, for example after new matches | `node replay.mjs --refresh --list` |

### Pick a match id

Run `node replay.mjs --list`. Each line shows a match id, the date and the teams:

```text
1529297  2026-05-10  Mumbai Indians vs Royal Challengers Bengaluru
```

Then start that match with `node replay.mjs --match 1529297`.
You can also find matches on [Cricsheet's match pages](https://cricsheet.org/matches/). A match id is the number in the match's file name, such as `1529297.json`.
Choose a match that was played to a finish. A match stopped by rain has fewer balls, and a tied match ends with a super over.

## What the feed returns

### `GET /live`: the balls so far, grouped by innings

```json
{
  "match_id": "1527687",
  "status": "live",
  "innings": [
    {
      "number": 1,
      "team": "Gujarat Titans",
      "balls": [ { "over": 0, "ball": 1, "...": "..." } ]
    }
  ]
}
```

- `status` is `not started`, `live` or `finished`.
- When the replay starts, `innings` holds the first innings with an empty `balls` list: no ball has been bowled yet.
- A later innings appears with its first ball. A super over is an innings with `"super_over": true`.
- `balls` is in playing order: the oldest ball first, the newest ball last.
- The feed gives the facts of each ball only. Match Centre works out the score, the overs, the batting and bowling figures and the commentary itself.

### One ball

This is the first ball of the default match, as `/live` returns it:

```json
{
  "over": 0,
  "ball": 1,
  "batter": "B Sai Sudharsan",
  "non_striker": "Shubman Gill",
  "bowler": "Mukesh Kumar",
  "runs": { "batter": 4, "extras": 0, "total": 4 }
}
```

| Field | Meaning |
|---|---|
| `over` | The over, counted from 0 as in Cricsheet. Ball `0.1` is the first ball of an innings. |
| `ball` | The ball in the over, 1 to 6. A wide or a no-ball does not count as one of the six, so the next ball repeats its number. |
| `batter` | The batter facing this ball |
| `non_striker` | The batter at the other end |
| `bowler` | The bowler |
| `runs.batter` | Runs scored off the bat |
| `runs.extras` | Extra runs: wides, no-balls, byes, leg byes or penalty runs |
| `runs.total` | `runs.batter` plus `runs.extras` |
| `runs.non_boundary` | Only there when it is `true`: the batters ran 4, so it was not a boundary |
| `extras` | Only on balls with extras: the kind and the runs, such as `{ "wides": 1 }`. The kinds are `wides`, `noballs`, `byes`, `legbyes` and `penalty`. |
| `wicket` | Only on wicket balls: `player_out`, `kind` (such as `caught`, `bowled`, `lbw` or `run out`), and `fielders`, a list of names, when a fielder was involved |

A wicket ball, from the same match:

```json
{
  "over": 2,
  "ball": 1,
  "batter": "B Sai Sudharsan",
  "non_striker": "Shubman Gill",
  "bowler": "Mukesh Kumar",
  "runs": { "batter": 0, "extras": 0, "total": 0 },
  "wicket": { "player_out": "B Sai Sudharsan", "kind": "bowled" }
}
```

### `GET /meta`: the match details

`/meta` returns `match_id`, `teams`, `venue`, `city`, `date`, `event`, `match_number`, `stage`, `season`, `toss`, `overs`, `balls_per_over`, `players` (each team's list), `seconds_per_ball`, `source` and `licence`.
It does not say who won, so the replay does not spoil the end.

## Calling it from a web page

Every answer has the header `Access-Control-Allow-Origin: *`, so any web page may read the feed: your Vite app on `http://localhost:5173` and your published page on `https://<username>.github.io`.
That is safe here, because the feed holds public match data and listens only on your own computer (`127.0.0.1`).
Chrome asks a public page for permission before it reads a server on your computer. When it asks to let the site reach devices on your local network, choose **Allow**.
The server answers Chrome's preflight request (`Access-Control-Request-Private-Network`) with `Access-Control-Allow-Private-Network: true`.

## If something goes wrong

| What you see | What to do |
|---|---|
| `port 8765 is busy` | Another replay, or another program such as a Docker container, uses the port. Stop it (Ctrl+C in a replay's terminal), or start this one with `--port 8766`. Then use `http://localhost:8766` in your `curl` commands and in `FEED_URL` in Match Centre's `src/api.ts`. |
| `could not download` | Check your internet connection. Or download https://cricsheet.org/downloads/ipl_json.zip in your browser and save it as `~/.cache/js-cricket-replay/ipl_json.zip`. |
| `match ... is not in the IPL archive` | Check the id with `--list`. New matches appear after `--refresh`. |
| The score stops changing | The match is over: `status` is `finished`. Stop the script and start it again. |
| `Failed to fetch` in the browser console | The replay is not running. Start it again with the command above. |

## Data licence and attribution

The match data comes from **Cricsheet** (https://cricsheet.org), made available under the **Open Data Commons Attribution License 1.0** (https://opendatacommons.org/licenses/by/1-0/).
Cricsheet asks that any public use of the data, or of a work made from it, gives credit.
So Match Centre must show a line such as: *Ball-by-ball data from Cricsheet (cricsheet.org), licensed under ODC-By 1.0.*
The script and its tests are under the kit's MIT licence. The kit does not include any Cricsheet data: the script downloads it on your computer.

## Run the tests

The tests use `synthetic_match.json`: a made-up match in Cricsheet's format, with made-up teams and players. It is not Cricsheet data. The tests use Node's built-in test runner and never use the internet.

```bash
cd ~/mern-ess-kit/tools/cricket-replay
node --test
```
