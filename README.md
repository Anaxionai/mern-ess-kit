# MERN-ESS course kit

This is the course kit for **MERN-ESS, MERN Stack Essentials (MongoDB, Express, React & Node)**, a 9-week course.
It holds what your tasks need beyond your own code: the laptop setup guide, a small MongoDB lab that runs on your laptop, practice data, one small tool, the Guided starters, the capstone briefs and the deploy guide.
Your task briefs link to files in this kit.

## Get the kit

Run this once, in Git Bash, in week 1 (Launchpad task 12, when you finish the laptop):

```bash
cd ~ && git clone https://github.com/Anaxionai/mern-ess-kit.git
```

This makes the folder `~/mern-ess-kit`, which is `C:\Users\<your name>\mern-ess-kit` on Windows.
Keep it next to your course repository, never inside it.

Check it: `ls ~/mern-ess-kit` lists `README.md`, `VERSIONS.md`, `setup` and the other folders below.

## Update the kit

When a task says "Run `git pull` in your copy of the course kit", run:

```bash
cd ~/mern-ess-kit
git pull
```

Do not change the kit's files. Copy a file into your own repository first, then change your copy.
If `git pull` says your local changes would be overwritten, run `git restore .` in the kit folder. It undoes your changes to the kit's files. Then run `git pull` again.

Every command in the kit's READMEs is written for **Git Bash**. [`setup/windows.md`](setup/windows.md) sets it up.

## The course in one table

| Weeks | Module | What you build | Kit folders it uses |
|---|---|---|---|
| 1 | LP Launchpad | Your page on the internet, first programs in JavaScript, a ready laptop | `setup/`, `try-it.md` |
| 2–3 | P1 PaisaLens | A command-line tool in Node.js and TypeScript for a UPI bank statement | `data/upi/`, `starters/p01-paisalens/` |
| 4–5 | P2 RailSeat API | An Express and MongoDB booking API with no double booking | `cloudlab/`, `data/public-apis.md`, `data/sample-db/`, `data/railseat/`, `starters/p02-railseat-api/` |
| 6 | P3 Match Centre | A live cricket scoreboard in React | `tools/cricket-replay/`, `starters/p03-matchcentre/` |
| 7 | P4 RailSeat web | The React front end for your RailSeat API | `cloudlab/`, `data/railseat/`, `starters/p04-railseat-web/` |
| 8 | CP1 Capstone 1 | Your own product: plan and core | `capstone/`, `cloudlab/` |
| 9 | CP2 Capstone 2 | Your product live on the internet over HTTPS, then torn down | `deploy/` |

## What is in the kit

| Path | What it is | Used in |
|---|---|---|
| `README.md` | This file | the whole course |
| `LICENSE`, `.gitattributes`, `.gitignore` | The MIT licence, LF line endings for every text file, and the local files Git ignores | the whole course |
| `VERSIONS.md` | The version of every tool, image and library the course uses, and how the course runs TypeScript | the whole course |
| `setup/windows.md` | Windows laptop setup in Git Bash: VS Code, Node.js LTS and npm, Docker Desktop (WSL 2), the `MSYS_NO_PATHCONV=1` rule | week 1 |
| `try-it.md` | Free sites where you practise each new idea in the browser | learn cards |
| `cloudlab/` | The cloud lab: one Docker Compose file with one profile, `mongo` (MongoDB 8.0 as a one-node replica set, and Mailpit). Its README has the connection string and memory advice. | P2 onwards (weeks 4 to 9) |
| `data/public-apis.md` | Free public APIs that need no key, with one example address each | P2 |
| `data/sample-db/` | `stations.json`: one collection of 40 Indian railway stations for your first MongoDB queries, and how to load it with `mongoimport` | P2 |
| `data/upi/` | `make_statement.py`: your own fake UPI bank statement, plus a sample and a starter rules file | P1 PaisaLens |
| `data/railseat/` | RailSeat's seed data (stations, trains, coaches, stops) as CSV, and its generator | P2 and P4 RailSeat |
| `tools/cricket-replay/` | `replay.mjs`: replays a real IPL match ball by ball as a live feed on port 8765 | P3 Match Centre |
| `starters/` | The Guided starters: a starting point for each project, for students on the Guided level | P1 to P4 |
| `capstone/` | How the capstone works, the plan template and three product briefs | CP1 and CP2 |
| `deploy/` | Going live in the capstone: a budget alarm first, a small cloud server, a free DuckDNS name, Caddy for HTTPS, the cost record and the teardown checklist | CP2 |

## Running the kit's scripts

- **`tools/cricket-replay`** is a Node.js script with no packages: `node replay.mjs` in its folder. Its tests run with `node --test`.
- **`data/upi` and `data/railseat`** hold two small Python generators. You do not install Python: Docker Desktop runs them in the official `python:3.12-alpine` image, with one command that each folder's README gives, for example:

  ```bash
  cd ~/mern-ess-kit/data/upi
  MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD":/work -w /work python:3.12-alpine python make_statement.py --student <your student id>
  ```

  The RailSeat CSV files are already in the kit, so you never need to run `make_seed.py`.

## Line endings

The kit's `.gitattributes` file makes Git check out every text file with LF line endings, on Windows too.
Shell scripts and data files then work in Git Bash and inside Linux containers, and Prettier does not report every line as changed. Do not convert them to CRLF.

## Licence and attribution

- **The kit's code** is under the MIT licence: see [`LICENSE`](LICENSE). That covers the scripts, tests, starters and configuration files written for the kit, unless a folder says otherwise.
- **Made-up data.** The UPI statements and RailSeat's trains and timetables are made up by the kit, and you may use them freely. The people, small shops and employers in the statements are invented. Real company names, such as Swiggy or Netflix, appear only to make the data look real. RailSeat is a training product: it has no link with Indian Railways or IRCTC. ClinicSlots, EventDesk and LendShelf are training briefs, not real services.
- **Station facts.** Station codes, names, cities, states and zones are public facts. The coordinates, platform counts and opening years come from English Wikipedia, read in November 2026. The kit uses those facts, not Wikipedia's text.
- **Cricket data.** `tools/cricket-replay` downloads ball-by-ball data from [Cricsheet](https://cricsheet.org). Cricsheet makes it available under the [Open Data Commons Attribution License 1.0](https://opendatacommons.org/licenses/by/1-0/). The kit itself holds no Cricsheet data: its test match is made up. Any public page that shows Cricsheet data must say so, for example: *Ball-by-ball data from Cricsheet (cricsheet.org), licensed under ODC-By 1.0.*
- **Public APIs** in `data/public-apis.md` each have their own terms; that file lists the ones that ask for credit.
- **Tools and images.** The tools, npm packages and Docker images the course uses keep their own licences. MongoDB's server is under the Server Side Public License (SSPL), which allows running it for your own app, as this course does. Docker Desktop is free under the Personal plan for individual learning. It is also free for small businesses with fewer than 250 employees and less than $10 million in yearly revenue.
- Company and product names belong to their owners.
