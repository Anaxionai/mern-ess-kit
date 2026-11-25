# Versions

The tools, images and libraries MERN-ESS uses, and the version of each.
Briefs never name versions: when a version matters, a task points here.
**Checked on 24 November 2026** against each project's official release page, the npm registry (`npm view <package> version`) or Docker Hub.

How to read the tables:

- **Pinned** means: use exactly this version. The kit's own files use it, such as `cloudlab/docker-compose.yml`.
- **Course version** means: install this version. A newer patch release (the last number) is fine.
- **Tested** means: the version the course was tested with. Your project's `package-lock.json` pins the exact version you get.

## On your laptop (Windows)

[`setup/windows.md`](setup/windows.md) installs these.

| Tool | Version | Kind | When | Notes |
|---|---|---|---|---|
| Windows | 11, version 23H2 or newer | minimum | week 1 | Docker Desktop needs 23H2 (build 22631) or newer |
| Git for Windows (Git Bash) | 2.56.1 | course version | week 1 | Any 2.45 or newer works. 2.56.1 was released on 10 November 2026 |
| VS Code | the newest | — | week 1 | It updates itself. Extensions: ESLint, Prettier |
| Node.js | 26.13.1 LTS ("Lithium") | course version | week 1 | The **Active LTS** line: v26 became LTS on 28 October 2026 and stays supported until 30 April 2029 (nodejs.org release schedule). 26.13.1 was released on 10 November 2026. Node.js 24 ("Krypton") is now in maintenance and also works. `winget install --id OpenJS.NodeJS.LTS --exact` gives 26.13.1 |
| npm | 11.20.0 | tested | week 1 | Comes with Node.js 26.13.1 |
| Docker Desktop | 4.100.1 | course version | week 1 | Released 23 November 2026, with the WSL 2 engine. Free under the Personal plan for individual learning, and for small businesses with fewer than 250 employees and less than $10 million in yearly revenue |
| WSL | 2.1.5 or newer | minimum | week 1 | Docker Desktop runs on it. Check with `wsl --version`; update with `wsl --update` |

### How the course runs TypeScript

Node.js 26 runs `.ts` files itself: **type stripping** is stable (nodejs.org, "Modules: TypeScript", v26.13.1 docs). `node src/cli.ts` removes the types and runs the JavaScript; it does not check types. So every project has two commands:

- `node src/file.ts` (or `npm run dev`) runs the code;
- `npx tsc --noEmit` (or `npm run typecheck`) checks the types.

Type stripping accepts only TypeScript that can be erased: no `enum`, no `namespace`, no constructor parameter properties. Imports name the `.ts` file, such as `import { load } from './load.ts'`. The P1 and P2 starters' `tsconfig.json` sets `erasableSyntaxOnly`, `verbatimModuleSyntax`, `allowImportingTsExtensions` and `noEmit`, so `tsc` reports anything Node cannot run, and `skipLibCheck`, so it checks your code, not the packages' own type files. No `tsx` or `ts-node` is needed. Node.js 26 has no `--experimental-transform-types` any more.

## Cloud lab images

These are pinned in [`cloudlab/docker-compose.yml`](cloudlab/docker-compose.yml). Do not change them in your own copy.

| Service | Image | Kind | Notes |
|---|---|---|---|
| MongoDB 8.0 | `mongo:8.0.38` | pinned | Runs as a one-node replica set `rs0`. The image includes `mongosh` 2.14.3, `mongoimport` and `mongoexport`. MongoDB 8.0 is the newest server line in Mongoose's compatibility table (mongoosejs.com, read 24 November 2026); `mongo:9.0` exists but is not listed there yet |
| Mailpit | `axllent/mailpit:v1.34.0` | pinned | Catches every email your app sends. Released 17 November 2026 |

## Images for the kit's data generators (P1, P2)

| Use | Image | Kind | Notes |
|---|---|---|---|
| Running `data/upi/make_statement.py` and `data/railseat/make_seed.py` | `python:3.12-alpine` (Python 3.12.16) | course version | You install no Python: Docker runs the script. See each folder's README |

## Images for your capstone's Dockerfiles and Compose files (CP2)

| Use | Image | Kind | Notes |
|---|---|---|---|
| The API (Node.js) | `node:26-alpine` (now `node:26.13.1-alpine`) | course version | The API's Dockerfile, and the build stage of the web Dockerfile |
| MongoDB in your Compose stack | `mongo:8.0` (now `mongo:8.0.38`) | course version | The `db` service, as a one-node replica set. See [`deploy/README.md`](deploy/README.md) |
| Serving the web app and HTTPS (Caddy 2) | `caddy:2-alpine` (now `caddy:2.11.9-alpine`) | course version | The final stage of the web Dockerfile. `caddy:2.11.9-alpine` was published on 13 November 2026 |

## The cloud server (CP2)

| What | Version | Notes |
|---|---|---|
| Server operating system | Ubuntu Server 24.04 LTS | The image in the EC2 console's Quick Start list |
| Docker on the server | the current Docker Engine and Compose plugin | Installed with Docker's script, `get.docker.com`, as [`deploy/README.md`](deploy/README.md) shows |

## GitHub Actions (P1)

Use these versions in workflow files, written as `uses: name@version`:

| Action | Version |
|---|---|
| `actions/checkout` | `v7` (now 7.0.1) |
| `actions/setup-node` | `v7` (now 7.1.0) |

Run jobs on `runs-on: ubuntu-latest`, with `node-version: 26` and `cache: npm` in `actions/setup-node`.

| Tool | Version | Kind | Notes |
|---|---|---|---|
| act | 0.2.98 | course version | Runs GitHub Actions workflows on your laptop, if Actions does not start (P1 task 27). `winget install -e --id nektos.act`; it needs Docker Desktop. 0.2.98 was released on 16 November 2026 |

## npm packages

Add them with `npm install`, for example `npm install zod@4.6.7` to pin one, or `npm install --save-dev vitest@5.1.1` for a tool only your tests and checks use. The Guided starters' `package-lock.json` files pin exactly these versions.

### P1 PaisaLens and P2 RailSeat API (and the capstone API)

| Package | Tested | Used in | Notes |
|---|---|---|---|
| `typescript` | 6.0.3 | P1 onwards | **Use 6.0, not 7.** TypeScript 7.0.2 exists, but `typescript-eslint` 8.74 accepts only TypeScript below 6.1. Install with `npm install --save-dev typescript@6.0` (the starters pin `~6.0.3`) |
| `@types/node` | 26.6.6 | P1 onwards | Node.js's own types for `fs`, `path` and `process` |
| `vitest` | 5.1.1 | P1 onwards | `npx vitest run` runs the tests once |
| `eslint` | 10.15.0 | P1 onwards | The linter. Its settings live in `eslint.config.js` |
| `@eslint/js` | 10.0.1 | P1 onwards | ESLint's recommended rules |
| `typescript-eslint` | 8.74.0 | P1 onwards | ESLint for TypeScript |
| `prettier` | 3.10.1 | P1 onwards | The formatter. `npx prettier --check .` |
| `csv-parse` | 7.0.3 | P1, P2 | Reads CSV with quoted fields: `import { parse } from 'csv-parse/sync'` |
| `csv-stringify` | 6.9.0 | P1 | Writes CSV: `import { stringify } from 'csv-stringify/sync'` |
| `commander` | 15.1.0 | P1 | The command line: subcommands, options and `--help` |
| `express` | 5.3.0 | P2 onwards | Express 5: an `async` route handler that throws reaches your error handler by itself |
| `@types/express` | 5.0.6 | P2 onwards | |
| `mongoose` | 9.13.0 | P2 onwards | Uses the MongoDB Node.js driver 7.9 |
| `zod` | 4.6.7 | P2 onwards | Validation of request bodies and query strings (and P4's search form) |
| `argon2` | 0.45.2 | P2 sign-in | Password hashing (argon2id). It ships a ready-built Windows x64 binary, so nothing compiles on your laptop; checked on Windows 11 with Node.js 26.13.1 |
| `cors` | 2.8.6 | P4 task 8 | In the API: lets the web app on port 5173 call it |
| `@types/cors` | 2.8.19 | P4 task 8 | |
| `supertest` | 7.3.2 | P2 onwards | API tests |
| `@types/supertest` | 7.2.1 | P2 onwards | |
| `mongodb-memory-server` | 11.4.0 | P2 onwards | Starts a real MongoDB for the tests, as a replica set (`MongoMemoryReplSet`). The P2 starter's `package.json` pins the server to MongoDB **8.0.38**, the cloud lab's version, and keeps it in `~/.cache/mongodb-binaries` (`"config": { "mongodbMemoryServer": { "version": "8.0.38", "preferGlobalPath": true } }`). **The first install or test run downloads it once: about 810 MB on Windows**; the kept `mongod` is 78 MB. Start it on a good connection |

npm 11.20 prints `install-scripts` warnings for `argon2` and `mongodb-memory-server`. They are only warnings: both packages worked on 24 November 2026.

### P3 and P4: the web apps

These come from `npm create vite@latest <folder> -- --template react-ts --no-interactive` (`create-vite` 9.3.4), as the P3 and P4 briefs use it. The Vite template brings its own TypeScript 7 and the `oxlint` linter, so the web apps use those, not P1's ESLint set-up.

| Package | Tested | Used in | Notes |
|---|---|---|---|
| `vite` | 8.3.7 | P3 onwards | 8.3.8 is the newest; any 8.3 works |
| `react`, `react-dom` | 19.3.1 | P3 onwards | |
| `@vitejs/plugin-react` | 6.3.0 | P3 onwards | |
| `typescript` | 7.0.2 | P3 onwards | The template asks for `~7.0.2`. Only the web apps use TypeScript 7 |
| `oxlint` | 1.93.0 | P3 onwards | The linter in Vite's template: `npm run lint` |
| `vitest` | 5.1.0 | P3 onwards | 5.1.1 is the newest; any 5.1 works |
| `react-router` | 8.5.2 | P4 | `npm install react-router` gives 8.5.2. Declarative mode: `BrowserRouter`, `Routes`, `Route`, `Link`, `useParams`, `useSearchParams` |
| `@tanstack/react-query` | 5.107.1 | P4 | 5.108.4 is the newest; any 5 works |
| `zod` | 4.6.7 | P4 | The same as the API |
| `@playwright/test` | 1.65.0 | P4 and CP2 | 1.65.1 is the newest. `npx playwright install chromium` downloads the browser once |
