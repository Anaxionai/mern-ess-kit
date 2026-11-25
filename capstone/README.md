# Your capstone: two weeks, one product of your own

In weeks 8 and 9 you build one small product of your own, with the same stack as RailSeat: **Node.js and TypeScript, Express 5 with Zod, MongoDB with Mongoose, and React**. In week 8 you plan it and build the core. In week 9 you package it with Docker Compose, put it on the internet over HTTPS for a day, tear the server down, and defend your work at the final gate (G3).

## The two weeks

| Week | Module | What happens |
|---|---|---|
| 8 | CP1: plan and build | Two learn cards and a concept check (tasks 1 to 3). **Day 1, task 4:** choose a brief or pitch your own, write `PLAN.md`, and get your mentor's approval. Then tasks 5 to 9 (about 13 hours): the data model, the core API, its tests with the hard rule, the main screen and a second feature. Task 10 is a milestone review with your mentor. |
| 9 | CP2: ship and defend | Learn cards on Compose, going live and telling your project's story. Then the whole app in Docker Compose, one end-to-end test, polish, a real deploy behind HTTPS with a budget alarm ([`deploy/README.md`](../deploy/README.md)), your portfolio, the README, a demo video and your three-minute talk. G3 is the final defence. |

Every build task is generic, such as "Build the core API endpoints from your plan". **Your `PLAN.md` is the specification**: AxReview grades each task against your own plan, so two students' tasks look different.

## Day 1: choose a brief or pitch your own

Read the three briefs and pick one:

| Brief | The product | The hard rule |
|---|---|---|
| [ClinicSlots](briefs/clinicslots.md) | Appointment booking for a small clinic | No two patients in one doctor's slot |
| [EventDesk](briefs/eventdesk.md) | A ticket desk for small events | Never sell more tickets than seats |
| [LendShelf](briefs/lendshelf.md) | Loans from a community library | One copy, one borrower at a time |

Each brief gives the problem, its users, the hard rule with a worked example, feature ideas marked **core** or **extra**, the main entities, a seed-data idea and a hint about constraints. Each hard rule is the same kind of problem as RailSeat's "two people, one seat", so the unique index, the conditional update, the transaction and the 20-request test you wrote in P2 are your starting point.

**An own pitch** is welcome if it keeps these rules. Your mentor approves it on day 1, before task 5:

- **One hard rule on a limited resource**: a slot, a seat, a copy, a room, a stock count. MongoDB must enforce it (a unique or partial unique index, or a conditional update), and a test must prove it.
- **At most 6 Must stories.** More ideas go under Nice.
- **About 13 build hours** for tasks 5 to 9. Cut stories until the Build plan fits.
- **The course stack only**: Express and Zod, MongoDB with Mongoose, React with TypeScript, Docker Compose. Payments, file uploads, live updates, AI features, MongoDB Atlas and Kubernetes are out of scope.
- **No real personal data**, no real money, and no data copied from a website that does not allow it.

**Sign-in is optional.** You built sign-up and log-in in RailSeat (P2 task 22), and you may reuse it. A product that uses two or three seeded demo users (for example a `X-User-Id` header or a user picker on the main screen) is fine, if the plan says so.

## Write `PLAN.md` (task 4)

Copy [`PLAN-template.md`](PLAN-template.md) into your task folder as `capstone/PLAN.md`. Keep its headings, in order:

| Heading | What goes in it | Filled in |
|---|---|---|
| `## Product` | Name, brief or "Own pitch", two sentences, 2 or 3 users, your mentor's approval line | task 4 |
| `## Hard rule` | The rule, an example with real values, how the database enforces it | task 4 |
| `## User stories` | 6 to 10 stories with Given, When, Then criteria, each with an unhappy path | task 4 |
| `## Must-haves and nice-to-haves` | At most 6 Must stories, the Nice ones, three things it will not do | task 4 |
| `## Screens` | 3 to 5 screens with routes and story IDs, the main screen marked | task 4 |
| `## Data model` | The Mermaid diagram (one entity per collection), embed or reference for each link, and the indexes and rules | task 5 |
| `## API endpoints` | Every endpoint with its stories and statuses | task 6 |
| `## Build plan` | Story IDs and hours for tasks 5 to 9, about 13 hours | task 4 |

Your mentor checks four things on day 1: the scope fits the hours; the hard rule is enforced by MongoDB (an index or a conditional update), not only in the browser; every story has acceptance criteria with real values and an unhappy path; and nothing needs an idea the course has not taught. They write `Approved by <name> on <date>` under `## Product` with you.

## Where your files go

Everything for the product lives in one `capstone/` folder inside each task folder, copied forward from the task before:

```text
<task folder>/
  capstone/
    PLAN.md            the plan: the specification for every task
    PROGRESS.md        one "## Task NN" section per task
    REVIEW.md          the CP1 milestone review (task 10)
    POLISH.md          what CP2's polish task changed
    README.md          the product's README (CP2)
    api/               Express: src/ (app.ts, server.ts, db.ts, models/, routes/, services/, schemas.ts),
                       seed/seed.ts, tests/, package.json, package-lock.json, tsconfig.json
    web/               React + TypeScript (Vite), and from CP2 its Dockerfile and Caddyfile
    compose.yml        CP2: db, api and web
    compose.prod.yml   CP2: the server's override (from deploy/compose.prod.example.yml)
    deploy/            CP2: DEPLOY.md and COST.md
  evidence.md          pasted command output, at the task folder's root
  EXPLAIN.md, TALK.md  in the tasks that ask for them
  AI_LOG.md            every use of chat AI
```

AxReview reads only the task's own folder, so copy `capstone/` forward every time a task tells you to. Leave out `node_modules/` and `dist/` when you copy, and run `npm install` in the copy. Never commit a `.env` file: commit `.env.example` with the setting names only.

## `PROGRESS.md`: what each task delivers

From task 5 on, every capstone task adds one section to `capstone/PROGRESS.md`, numbered with two digits. AxReview checks your files against the plan items you name there:

```markdown
## Task 06
Delivers: S01, S02, S04 (endpoints POST /appointments, GET /appointments/mine, POST /appointments/:id/cancel)
Works: all three, with 404 and the hard-rule 409; see evidence.md
Changed: S05 moved to task 9, because the cancel window needed a new field
```

If the plan changes, change `PLAN.md` in your current task folder and give the reason in `PROGRESS.md`. A change may move stories between tasks or cut Nice stories. It may not drop the hard rule.

## Reuse your own code

Your projects are your parts bin:

| You need | Reuse from |
|---|---|
| `package.json`, `tsconfig.json`, `src/app.ts`, `src/server.ts`, `src/db.ts`, the Mongoose models and the seed script | RailSeat API (P2), tasks 12 and onwards |
| The hard rule (unique index or conditional update, the transaction) and the 20-request race test with `MongoMemoryReplSet` | RailSeat API (P2), task 20 |
| Sign-up, log-in and "users see only their own records" (optional) | RailSeat API (P2), task 22 |
| Routes, a validated form, TanStack Query hooks and the lost-race message | RailSeat web (P4) |
| A Playwright test | RailSeat web (P4) |
| Loading, error and empty states, and keyboard checks | Match Centre (P3) |

Copying another student's code is not reuse.

## The AI rules

- **Chat AI** (such as ChatGPT, Claude or Gemini) may help with code. Every use goes in `AI_LOG.md` in the task folder: what you asked, what it said, what you kept, what you changed and what was wrong.
- **No coding agent** (an AI tool that edits your files and runs commands) in this course.
- **No AI** for concept checks, gate answers or your defence answers.
- You must be able to explain every line of your product. G3 may ask about any line.

## The final defence (G3)

In week 9 you give a three-minute talk and a live demo, then answer questions. Be ready to:

- show the hard rule holding, and the test that proves it;
- explain your collections and indexes, one endpoint and one screen, line by line;
- show the deploy evidence: the budget alarm, the HTTPS checks, the cost record and the teardown.

## Data and privacy

Use made-up people only: no real names, phone numbers, Aadhaar or PAN numbers, addresses or medical details. Make test data with your seed script, and keep every secret (passwords, tokens, `.env` files, private keys) out of Git.
