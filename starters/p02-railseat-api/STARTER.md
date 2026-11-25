# RailSeat API Guided starter (P2, module 3, weeks 4 and 5)

This folder is a ready-made `railseat/` product folder for the Guided level of
P2. It does the set-up for you: the npm project in `api/`, TypeScript, the
Express app and server, the Mongoose connection, Vitest with an in-memory
MongoDB replica set, ESLint, Prettier, and the name and signature of every
function and route the briefs ask for. It gives you no answers: each one
throws `new Error("TODO(task NN): ...")`, and you write it in task NN of
module 3 (P2 RailSeat API).

## What is included

- `docs/model.md`: the headings of your data model (task 11).
- `api/package.json`: `"type": "module"`, the scripts `dev`
  (`node --watch src/server.ts`), `start`, `seed`, `test`, `lint`, `format`,
  `format:check` and `typecheck`, and every package P2 needs: `express`,
  `mongoose`, `zod`, `argon2`, `csv-parse`; for development `typescript` 6.0,
  `@types/node`, `@types/express`, `vitest`, `supertest`, `@types/supertest`,
  `mongodb-memory-server`, ESLint and Prettier. `package-lock.json` pins them.
- `api/tsconfig.json`, `eslint.config.js`, `.prettierignore`, `.gitignore`,
  `.env.example` and `vitest.config.ts`.
- `api/src/`: `db.ts` and `server.ts` (ready), `app.ts` (ready, with a
  stub error handler), `errors.ts`, `schemas.ts`, `security.ts`,
  `models/` (station, train, journey, booking, user), `routes/` (trains,
  bookings, auth) and `services/booking.ts`.
- `api/seed/loadSeed.ts`, `api/queries/search.mongodb.js`.
- `api/tests/`: `setup.ts` (ready: starts `MongoMemoryReplSet`, connects
  Mongoose, empties the database before each test), `helpers.ts`, and
  `doubleBooking.test.ts` and `ownership.test.ts` as `test.todo` plans.

## Copy it in (task 11)

First run `git pull` in your kit folder. Then, in Git Bash, in task 11's
folder:

```bash
cp -r ~/mern-ess-kit/starters/p02-railseat-api railseat
cd railseat/api
npm install
```

Task 11 is the data model only: fill `docs/model.md`. Copy the starter only
once. From task 12 on, you copy your own `railseat/` folder forward, without
`api/node_modules/`, and run `npm install` in `railseat/api`. Task 12 step 1
and the package installs in tasks 20 and 22 are done already: running them
changes nothing.

## Run it

```bash
npm run dev     # needs the cloud lab: RailSeat API on http://localhost:3000
curl http://localhost:3000/health    # {"status":"ok"}
npm test        # 2 todo
npx tsc         # prints nothing
npm run lint    # no problems
```

Every other route answers 500 with its TODO message until you write it.

**The first `npm install` downloads MongoDB for the tests once: about
810 MB.** Do it on a good connection. The test server (`mongod`, 78 MB) is
kept in `~/.cache/mongodb-binaries`, so later installs and copies reuse it.
`package.json` (`"config"`) chooses MongoDB 8.0.38, the cloud lab's version.
npm may print `install-scripts` warnings for `argon2` and
`mongodb-memory-server`; they are harmless here.

## Your TODOs

| Task | Files | What you write |
|---|---|---|
| 11 | `docs/model.md` | the collections, examples, diagram, reasons, keys and the rule |
| 12 | `src/models/*.ts`, `seed/loadSeed.ts` | the schemas, unique keys and the stops index; the seed script |
| 18 | `queries/search.mongodb.js`, `schemas.ts`, `routes/trains.ts`, `errors.ts`, `app.ts` | the pipeline, `searchQuery`, both routes, `NotFound`; 404 and 400 in the error handler |
| 19 | `schemas.ts`, `services/booking.ts`, `routes/bookings.ts`, `errors.ts`, `app.ts` | `bookingIn`, `toBookingOut`, `newPnr`, `bookSeat`, `getBooking`, `cancelBooking`, three routes; `SeatTaken`, `AlreadyCancelled`, 409 |
| 20 | `services/booking.ts`, `models/booking.ts`, `tests/setup.ts`, `tests/doubleBooking.test.ts` | the conditional update, the partial unique index, the transaction; the test data and the 20-request test |
| 21 | `schemas.ts`, `queries/search.mongodb.js`, `routes/trains.ts` | the rules, `limit` and `offset`; sort, skip and limit |
| 22 | `models/user.ts`, `models/booking.ts`, `security.ts`, `routes/auth.ts`, `routes/bookings.ts`, `services/booking.ts`, `tests/` | users and tokens, argon2, sign-up and log-in, `currentUser`, `GET /bookings`, `getBookingFor`; the helper and the ownership test |

Tasks 13 to 16 are learn cards and task 17 a concept check. Task 23, the
milestone review, has no TODO: you explain your choices in writing.

To see what is left, search the folder for `TODO` with Ctrl+Shift+F in VS
Code. Delete each TODO comment when you have done it. When a `test.todo`
becomes a real test, write it with `test(...)`.

## Good to know

- Local imports end in `.ts`, and type-only imports use `import type`:
  Node removes the types itself and checks nothing. `npx tsc` checks them.
- `tsconfig.json` sets `skipLibCheck`, so `tsc` checks your code, not the
  packages' own type files.
- The tests never use the cloud lab: `tests/setup.ts` starts its own MongoDB.

## What you still write yourself

Everything a task asks for: the data model, every schema field and index,
the seed script, the pipeline, every route, service and error, the test
data and every test, and your `evidence.md`, `AI_LOG.md` and review notes.
