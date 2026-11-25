# Match Centre Guided starter (P3, module 4, week 6)

This folder is a ready-made `matchcentre/` project for the Guided level of P3.
It does the set-up for you: the Vite project, the test runner, the file
layout, and the typed signature of every function and component the briefs
ask for. It gives you no answers. Each stub throws
`new Error('TODO(task NN): ...')`, and you write it in task NN of module 4
(P3 Match Centre).

You need nothing beyond what you have learnt: the TypeScript the stubs use
(types, interfaces, arrays and objects) is P1's, and cards 5 and 6 of this
module teach the React (components, props, state and effects).

## What is included

- The Vite React TypeScript project that task 9's `npm create vite@latest`
  makes (React 19, Vite 8, TypeScript 7, oxlint), without the start page's
  images, `App.css` and `README.md`. `package-lock.json` pins every version.
- Vitest and the `test` script that task 10 asks for, so `npm test` works now.
  `src/score.test.ts` holds three `it.todo` stubs for the tests you write in
  task 10, and `tests/` holds the starter checks (see below).
- `mockup.html`: its head is ready (viewport tag and stylesheet link). The
  body is yours.
- `src/index.css`: empty, for all your styles.
- `src/types.ts`: `Ball`, `Innings`, `MatchState` and `MatchMeta` are empty,
  because typing the real feed is task 10. `BattingRow` and `BowlingRow`
  (task 11, step 2) are given.
- `src/score.ts`, `src/api.ts` and `src/components/*.tsx`: stubs with typed
  parameters and props.
- `src/App.tsx`: a placeholder page, so that `npm run dev` works at once.

Not included, because they are yours: `src/sample.ts` and
`src/live-sample.json` (task 10), and `docs/` and `README.md` (task 15).

## Copy it in (task 9, step 1)

You need the Node.js version in the kit's `VERSIONS.md`, which you installed
in Launchpad task 6 (task 9, Before you start). Run `git pull` in your
kit folder. Then, in Git Bash, in task 9's folder:

```bash
cp -r ~/mern-ess-kit/starters/p03-matchcentre matchcentre
cd matchcentre
npm install
npm run dev
```

At `http://localhost:5173` you see the starter's placeholder page, not the
Vite start page that step 2 describes. Then go on with step 3: `mockup.html`
exists and its head is ready (the viewport tag, and step 4's stylesheet link),
so you start with its body: the header in step 4.

Copy the starter only once, in task 9. From task 10 on, you copy your own
`matchcentre/` folder forward, as each brief says.

## Run it

```bash
npm run dev     # the app at http://localhost:5173, the mock-up at /mockup.html
npm run build   # the type check (tsc -b), then the production build
npm test        # skipped checks and 3 todo, until you write tests and switch checks on
```

In task 10, step 10, `npm install -D vitest` and the `test` script are done
already. If you run the install, nothing changes.

## The starter checks

- `tests/score-checks.test.ts`: `battingCard`, `bowlingCard` and
  `describeBall` (task 11).
- `tests/tables-checks.test.ts`: `BattingTable` and `BowlingTable` (task 11).
- `tests/api-checks.test.ts`: `fetchLive` and `fetchMeta` (task 12).

When you finish a task, delete `.skip` from its group and run `npm test`.
The checks use a made-up innings in the feed's format, and test only figures
that every fair way of counting agrees on. They are not part of your tasks.
`npm run build` does not type-check `tests/`, so a check never breaks your build.

The starter does not test `inningsRuns`, `inningsWickets` or `oversText`:
you test them yourself in `src/score.test.ts` (task 10), with values from
your own sample.

## Two settings to know

- `tsconfig.app.json` sets `noUnusedParameters` to `false`, because the stubs
  do not read their parameters yet. When every TODO is done, you may set it
  back to `true`, as in a new Vite project.
- `index.html` has `<link rel="icon" href="data:," />`. There is no icon
  file, and this stops the browser asking for `/favicon.ico`.

## Your TODOs

| Task | Files | What you write |
|---|---|---|
| 9 | `mockup.html`, `src/index.css` | the static page with two sections, and its phone-first layout |
| 10 | `src/types.ts`, `src/score.ts`, `src/score.test.ts`, `src/main.tsx` | the four feed types, `src/sample.ts` and the saved sample; `inningsRuns`, `inningsWickets`, `oversText` and their three tests; the console check |
| 11 | `src/score.ts`, `src/components/` (four files), `src/App.tsx` | `battingCard`, `bowlingCard`, `describeBall`; `Scorecard`, `BattingTable`, `BowlingTable`, `Commentary`; the page in JSX |
| 12 | `src/api.ts`, `src/App.tsx` | `fetchLive`, `fetchMeta`; polling every 2 seconds, with a clean-up |
| 13 | `src/App.tsx`, `src/index.css` | the loading, error and empty states; the accessibility fixes |
| 14 | `vite.config.ts`, `index.html` | the `base` for GitHub Pages; the title and description |

Tasks 1 to 7 are learn cards and task 8 is the concept check: none of them
uses the starter. Task 15, the wrap-up, has no TODO: you write `README.md`
and `EXPLAIN.md`, not code.

The run-rate chart is a Stretch goal, not a task: the starter has no stub
for it.

To see what is left, search the folder for `TODO` with Ctrl+Shift+F in
VS Code. Delete each TODO comment when you have done it.

## The Cricsheet credit

The replay data comes from Cricsheet under the ODC-By 1.0 licence, which asks
a public page to credit it (see the kit's `tools/cricket-replay/README.md`).
The placeholder page shows a credit line. Keep one like it when you rebuild
the page in task 11, so your published page in task 14 has it.

## What you still write yourself

Everything a task asks for:

- the HTML of the mock-up and every style in `src/index.css`;
- the four feed types, `src/sample.ts`, your saved sample and your tests;
- every function body in `score.ts` and `api.ts`;
- every component, its state and effects, and the three states;
- the GitHub Pages set-up, `evidence.md`, `AI_LOG.md` and the wrap-up files.
