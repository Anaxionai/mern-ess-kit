// TODO(task 11): replace this placeholder with your header and main area from
//   mockup.html, written as JSX, with Scorecard and Commentary fed from the
//   saved sample.
// TODO(task 12): keep the match in state, fetch /live every 2 seconds in an
//   effect that cleans up after itself, fetch /meta once for the header, and
//   feed the components from the live match.
// TODO(task 13): show a loading state, an error state that keeps the last good
//   score on screen, and an empty state for an innings with no balls yet.
//
// Keep a credit line for the data on your page, such as "Ball-by-ball data from
// Cricsheet (cricsheet.org), licensed under ODC-By 1.0." The data licence asks
// for it: see the kit's tools/cricket-replay/README.md.

/** A placeholder page, so that `npm run dev` shows something before task 11. */
export default function App() {
  return (
    <main>
      <h1>Match Centre</h1>
      <p>The Guided starter is running. Build your layout in mockup.html first.</p>
      <p>
        <small>
          Ball-by-ball data from Cricsheet (cricsheet.org), licensed under ODC-By 1.0.
        </small>
      </p>
    </main>
  )
}
