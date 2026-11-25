# Guided starters

Every project in MERN-ESS has three levels. Your mentor tells you yours, and may change it as you go.

- **Core**: you start from an empty folder and follow the task brief.
- **Guided**: you start from the starter in this folder. It does the set-up for you: project files, folder layout, configuration, test set-up, types and function signatures. Every piece of logic the tasks ask for is still yours to write. It is marked `TODO(task NN)`, with NN the task's number in that project's module.
- **Stretch**: Core, plus the module's Stretch goals.

A starter never contains a solution. AxReview grades Guided and Core work against the same Source of Truth.

| Folder | Project | Module | Weeks | Copy it in | Copy into |
|---|---|---|---|---|---|
| `p01-paisalens/` | P1 PaisaLens | 2 | 2 and 3 | task 8 | `paisalens/` |
| `p02-railseat-api/` | P2 RailSeat API | 3 | 4 and 5 | task 11 | `railseat/` (the whole product folder: `docs/` and `api/`) |
| `p03-matchcentre/` | P3 Match Centre | 4 | 6 | task 9 | `matchcentre/` |
| `p04-railseat-web/` | P4 RailSeat web | 5 | 7 | task 7 | `railseat/web/` |

The capstone (weeks 8 and 9) has no starter: you reuse your own code from these projects, as [`../capstone/README.md`](../capstone/README.md) explains.

## How to use one

1. Pull the kit first, so you have the latest version: `cd ~/mern-ess-kit && git pull`.
2. Open the folder's `STARTER.md`. It gives the exact copy command, how to run the project, and a table of every TODO with its task number.
3. In Git Bash, `cd` to the task folder the brief names, then run the copy command from `STARTER.md`, for example:
   ```bash
   cp -r ~/mern-ess-kit/starters/p01-paisalens paisalens
   ```
4. Install and check it as `STARTER.md` says (`npm install`, then `npm test`). Everything passes as shipped.
5. Work through the tasks. When a task's TODOs are done, remove the `skip` or `todo` marks from that task's tests so they run.

Copy a starter only once, in the task the table names. After that, you copy your own product folder forward from task to task, without `node_modules/`, and run `npm install` in the copy, as each brief says.

## Good to know

- **Skipped tests are normal.** Before you write a task's code, its tests show as "skipped" or "todo" in the output. They are not failures. Paste the output as the brief asks.
- **`STARTER.md` is not your README.** You write the product's `README.md` yourself in the project's wrap-up.
- **Line endings:** the kit's `.gitattributes` keeps every text file in LF. If you create a shell script, check that VS Code's status bar says `LF`.
- **Versions:** the starters use the versions in the kit's `VERSIONS.md`. Commit `package-lock.json` with your code, never `node_modules/`.
- **Stuck on a TODO?** Read the task's Learn links, ask AxTutor to explain the idea (not to write the code), then ask your mentor.
