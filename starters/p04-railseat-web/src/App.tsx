import Search from './routes/Search.tsx'

// The app's frame: a header on every page, and one route per page.
// main.tsx already wraps <App /> in <BrowserRouter>.
export default function App() {
  // TODO(task 7):
  // - Add a header with a <NavLink> to Search ("/") and one to My bookings
  //   ("/bookings"), so the current page is marked.
  // - Declare the routes with <Routes> and <Route>: "/" (Search), "/results"
  //   (Results), "/journeys/:journeyId/seats" (SeatMap), "/bookings"
  //   (MyBookings) and "*" (NotFound).
  // Until then, the app shows only the Search page.
  //
  // TODO(task 11):
  // - Add the route "/login" (Login), and wrap SeatMap and MyBookings in
  //   <RequireAuth> from src/auth/RequireAuth.tsx.
  // - Wrap the routes in <AuthProvider> from src/auth/AuthContext.tsx (it sits
  //   inside QueryClientProvider and BrowserRouter, which main.tsx provides).
  // - In the header, show the signed-in email and a Sign out button, or a
  //   Sign in link.
  return (
    <main>
      <Search />
    </main>
  )
}
