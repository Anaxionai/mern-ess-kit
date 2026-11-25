// The signed-in passenger's bookings. Route: "/bookings", inside RequireAuth.
export default function MyBookings() {
  // TODO(task 11): call useMyBookings(), and show a card per booking: PNR,
  // train, date, coach, seat and status.
  // - Show a loading state, an error, and "No bookings yet" with a link to
  //   Search when the list is empty.
  // - When the call fails with a 401 ApiError, call logout() and send the
  //   passenger to /login with "Please sign in again."
  return <h1>My bookings</h1>
}
