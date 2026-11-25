# PaisaLens Guided starter (P1, module 2, weeks 2 and 3)

This folder is a ready-made `paisalens/` project for the Guided level of P1.
It does the set-up for you: the npm project, TypeScript, Vitest, ESLint,
Prettier, and the name and signature of every function the briefs ask for.
It gives you no answers. Each function body throws
`new Error("TODO(task NN): ...")`, and you write it in task NN of module 2
(P1 PaisaLens).

## What is included

- `package.json`: the npm project `paisalens` with `"type": "module"`, and
  the scripts `start`, `test`, `lint`, `format`, `format:check` and
  `typecheck`. `package-lock.json` pins every version, so your install
  matches everyone else's.
- Packages: `csv-parse` (task 8), `csv-stringify` (task 24) and `commander`
  (task 25); for development, `typescript` 6.0, `@types/node`, `vitest`,
  `eslint`, `@eslint/js`, `typescript-eslint` and `prettier`.
- `tsconfig.json`: the settings that make `npx tsc` check your code the way
  Node runs it (type stripping: no `enum`, imports end in `.ts`).
- `eslint.config.js`, `.prettierignore` and `.gitignore` (which keeps
  `node_modules/` out of Git).
- `src/`: `load.ts`, `report.ts`, `clean.ts`, `categorise.ts`, `models.ts`,
  `recurring.ts`, `errors.ts`, `commands.ts` and `cli.ts`. Each stub has a
  comment that says what it must do.
- `tests/starter-checks.test.ts`: three ready-made checks (see below).

Not included, because they are yours: `data/statement.csv` (task 8),
`rules.json` (task 10), your test files (tasks 11 to 26),
`tests/data/mini_statement.csv` and `tests/fixtures.ts` (task 26), the
workflow files (task 27), and `README.md` (task 28).

## Copy it in (task 8, step 1)

First run `git pull` in your kit folder, as task 8 says. Then, in Git Bash,
in task 8's folder:

```bash
cp -r ~/mern-ess-kit/starters/p01-paisalens paisalens
cd paisalens
npm install
```

Copy the starter only once, in task 8. From task 9 on, you copy your own
`paisalens/` folder forward, without `node_modules/`, as each brief says.
Steps 2 and 3 of task 8 (installing packages, copying `tsconfig.json`) are
done already. If you run them, nothing changes.

## Run it

```bash
node src/cli.ts     # PaisaLens is ready. Write your summary here in task 8.
npm test            # 3 skipped
npx tsc             # prints nothing: no type errors
npm run lint        # no problems
```

## The starter checks

`tests/starter-checks.test.ts` checks the results of `rupees` (task 9),
`parseDate` (task 21) and `isMonthly` (task 23). Each check is skipped until
its task. When you finish that task, change its `test.skip` to `test` and run
`npm test`. They do not count as your tests: the tests each task asks for are
yours.

## Your TODOs

| Task | Files                                                       | What you write                                                                                                                                   |
| ---- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 8    | `load.ts`, `cli.ts`                                         | `toPaise`, `isBroken`, `readStatement`; the summary in `cli.ts`                                                                                  |
| 9    | `report.ts`, `clean.ts`, `load.ts`, `cli.ts`                | `monthOf`, `monthlyTotals`, `byMerchant`, `rupees`; a first `cleanMerchant`; the merchant on each row, repeats skipped; months and top 10        |
| 10   | `categorise.ts`, `report.ts`, `load.ts`, `cli.ts`           | `loadRules`, `categorise`, `byCategory`; the category totals                                                                                     |
| 11   | `tests/load.test.ts`, `clean.test.ts`, `categorise.test.ts` | your first tests, 6 or more (Vitest is installed already)                                                                                        |
| 21   | `models.ts`, `load.ts`, `report.ts`, `categorise.ts`        | the `TransactionData` fields and the `Transaction` class; `parseDate`, `parseRow`; a bad date in `isBroken`; delete `StatementRow` and `monthOf` |
| 22   | `clean.ts`                                                  | `cleanMerchant` with regular expressions, `ALIASES`; a `test.each` table                                                                         |
| 23   | `models.ts`, `recurring.ts`, `cli.ts`                       | the `Subscription` fields, `isMonthly`, `findRecurring`; three tests                                                                             |
| 24   | `errors.ts`, `load.ts`, `cli.ts`                            | `BadRow`, `ErrorReport`; `readStatement(path, report)`; `toThrow` tests                                                                          |
| 25   | `commands.ts`, `report.ts`, `cli.ts`                        | `loadAll`, the three commands, `renderReport`; `cli.ts` only runs the program                                                                    |
| 26   | `tests/`                                                    | the fixtures and the pipeline tests                                                                                                              |

Tasks 1 to 6 and 13 to 19 are learn cards, tasks 7 and 20 are concept checks:
none of them uses the starter.

- Task 12 (a branch and a pull request) changes no PaisaLens code.
- Task 27 has no TODO: ESLint, Prettier, their scripts, `eslint.config.js`
  and `.prettierignore` are set up already. You run them, fix what they
  find, and write the GitHub Actions workflow yourself. `eslint.config.js`
  allows unused function parameters, because the stubs have them; an unused
  import, as in task 27's deliberate error, is still an error.
- Task 28, the wrap-up, has no TODO: you write `README.md` and `EXPLAIN.md`.

To see what is left, search the folder for `TODO` with Ctrl+Shift+F in
VS Code. Delete each TODO comment when you have done it.

## What you still write yourself

Everything a task asks for:

- every function body, and the code in `cli.ts`;
- the fields of `TransactionData`, `Transaction` and `Subscription`, and the
  `BadRow` class;
- the commander commands and their options;
- every test and fixture, and the small test statement;
- your rules, `NOTES.md`, `AI_LOG.md`, `evidence.md` and the wrap-up files.

The starter checks test only three results. They never replace your tests.
