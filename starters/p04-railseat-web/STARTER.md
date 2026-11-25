# RailSeat web: the Guided starter for P4 (module 5, week 7)

This folder is a `railseat/web/` folder with the set-up already done: a Vite, React and TypeScript app with React Router, TanStack Query, Zod, Vitest and Playwright installed and configured, the pages, the API's types and the hooks' signatures. All the logic that a task asks for is still yours. Each piece is marked `TODO(task NN)`, where NN is the task's number in module 5 (P4 RailSeat web).

It talks to your own RailSeat API from P2 (module 3), with the sign-in you built in its task 22.

## What is included

| Path | What it gives you |
|---|---|
| `package.json`, `package-lock.json` | Every P4 package at a pinned version, and the scripts `dev`, `build`, `lint`, `preview` and `test` (`vitest run src`) |
| `vite.config.ts` | The React plugin, and port 5173 kept fixed for CORS |
| `src/main.tsx` | `<QueryClientProvider>` and `<BrowserRouter>` around `<App />` |
| `src/App.tsx` | Shows only the Search page. You add the header, the routes and the sign-in parts. |
| `src/routes/` | `Search`, `Results`, `SeatMap`, `MyBookings`, `Login` and `NotFound`, each with an `<h1>`; `searchSchema.ts` (the shape only) and `searchSchema.test.ts` (five skipped cases) |
| `src/auth/AuthContext.tsx` | The `Auth` type, the context, `useAuth()`, and the `AuthProvider` stub |
| `src/auth/RequireAuth.tsx` | A wrapper that shows every page until you write the redirect |
| `src/api/client.ts` | `BASE_URL`, `ApiError`, the types `TrainResult`, `Seat`, `Booking` and `BookingIn`, and the `setToken` stub. `api()` is a TODO. |
| `src/api/queries.ts` | The signatures of `useTrainSearch`, `useSeats`, `useMyBookings` and `useBookSeat` |
| `src/index.css` | Plain, readable styles. This course uses plain CSS, no CSS framework. |
| `playwright.config.ts` | Chromium only, one worker, a trace for each failure, `baseURL`, and a `webServer` that runs `npm run dev` |
| `tests/e2e/booking.spec.ts` | The end-to-end test, skipped, and a date helper to write |
| `.gitignore` | Keeps `node_modules/`, `dist/`, `*.local` and Playwright's output out of Git |

## Copy it in (task 7, step 1)

You need the Node.js version in the kit's `VERSIONS.md` (`node --version`), as in P3. In Git Bash, in task 7's folder, after you copy your `railseat/` folder from P2 and before you have a `railseat/web/` folder:

```bash
cp -r ~/mern-ess-kit/starters/p04-railseat-web railseat/web
cd railseat/web
npm install
```

From task 8 on, you copy your own `railseat/` folder forward, as each brief says.

## Run it

In `railseat/web/`:

```bash
npm run dev     # then open http://localhost:5173
npm run build   # checks the types, then builds into dist/
npm test        # 5 skipped until task 9
```

For task 13, install the test browser once with `npx playwright install chromium`, then run `npx playwright test`. Playwright starts the web app itself, so start the cloud lab's MongoDB and your API first.

## Steps already done for you

- **Task 7:** step 1 (copy this folder instead of `npm create vite`), step 2 (`react-router` is installed, so run only `npm install`), step 3 (the pages exist), and the first half of step 4 (`<BrowserRouter>` is in `main.tsx`; you declare the routes in `App.tsx`).
- **Task 8:** the types and `ApiError` in `client.ts` (steps 2 and 3, but not `api()` itself). The CORS fix (steps 7 and 8) goes in your own API's `src/app.ts`, not here.
- **Task 9:** `zod` is installed (step 2), and Vitest and the `test` script are set up (step 10).
- **Task 10:** step 1 is done: TanStack Query is installed, and `<QueryClientProvider>` is in `main.tsx`.
- **Task 11:** the files exist: `src/auth/AuthContext.tsx`, `src/auth/RequireAuth.tsx`, `src/routes/Login.tsx`, `setToken` in `client.ts` and `useMyBookings` in `queries.ts`. Every step is still yours.
- **Task 13:** steps 1 to 3 are done, except installing the browser. There is no example test to delete.

## TODO map

| Task | File | What you write |
|---|---|---|
| 7 | `src/App.tsx` | The header with two `<NavLink>`s, and the five routes |
| 7 | `src/routes/Search.tsx`, `Results.tsx`, `SeatMap.tsx` | The temporary search button, `useSearchParams`, the `<Link>` and `useParams` |
| 8 | `src/api/client.ts` | `api<T>()`, which throws an `ApiError` for an answer that is not 2xx |
| 8 | `src/routes/Results.tsx` | The first API call, in a `useEffect` |
| 9 | `src/routes/searchSchema.ts`, `searchSchema.test.ts` | The schema's rules and its five test cases |
| 9 | `src/routes/Search.tsx`, `Results.tsx` | The form, and the check of the URL's values |
| 10 | `src/api/queries.ts` | `useTrainSearch` and `useSeats` |
| 10 | `src/routes/Results.tsx`, `SeatMap.tsx`, `src/index.css` | `TrainList`, and the seat grid with its coach buttons |
| 11 | `src/api/client.ts` | The token in memory, `setToken`, and the `Authorization` header in `api()` |
| 11 | `src/auth/AuthContext.tsx`, `src/auth/RequireAuth.tsx` | `AuthProvider` with `login` and `logout`; the redirect to `/login` |
| 11 | `src/routes/Login.tsx`, `src/routes/MyBookings.tsx`, `src/api/queries.ts`, `src/App.tsx` | The sign-in form, `useMyBookings` and the booking cards, the header and the protected routes |
| 12 | `src/api/queries.ts`, `src/routes/SeatMap.tsx` | `useBookSeat`, the booking form and its messages, including the lost race (409) |
| 13 | `tests/e2e/booking.spec.ts` | The date helper and the test |

Tasks 1 to 5 are learn cards and task 6 is the concept check. Task 14 is the wrap-up (`railseat/README.md` and `EXPLAIN.md`). None of them writes code here, so none has a TODO.

## What you still write yourself

- Every route, page and form, and the whole seat map.
- `api()`, the token, every hook in `queries.ts` (keys, `staleTime` and the invalidations), and the sign-in context.
- The schema, its unit tests and the Playwright test.
- The CORS change in your API, `evidence.md`, `AI_LOG.md`, `railseat/README.md` and `EXPLAIN.md`.

Delete each TODO comment when you finish it. When none are left, you may delete this file.
