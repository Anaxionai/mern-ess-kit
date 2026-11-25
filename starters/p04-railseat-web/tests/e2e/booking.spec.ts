import { test } from '@playwright/test'

// The end-to-end test of the booking flow (task 13).
// It needs the cloud lab's MongoDB, a seeded API on http://localhost:3000 with sign-in
// (P2 task 22), and a journey from NDLS to BCT in the next few days.
// Run it with: npx playwright test
// Find elements only with getByRole, getByLabel and getByText, and never use
// waitForTimeout. Change `test.skip` to `test` when you write it.

// The date 3 days from today as YYYY-MM-DD, in local time.
function inThreeDays(): string {
  // TODO(task 13): compute the date. Never type a fixed date: it will pass.
  throw new Error('TODO(task 13): return the date 3 days from today')
}

test.skip('sign in, search and book a seat', async () => {
  // TODO(task 13):
  // - With the `request` fixture, sign up a fresh passenger:
  //   POST http://localhost:3000/auth/signup with an email such as
  //   `e2e-${Date.now()}@example.com`.
  // - With the `page` fixture, open /login once and sign in through the form.
  //   From then on, move by clicking links: a reload loses the token.
  // - Search NDLS to BCT on inThreeDays(), open the first train's seats, pick
  //   the first free seat, fill in a passenger and press Book
  //   (getByRole('button', { name: 'Book', exact: true })).
  // - Expect a 10-character PNR on the page.
  throw new Error(`TODO(task 13): sign in, search and book on ${inThreeDays()}`)
})
