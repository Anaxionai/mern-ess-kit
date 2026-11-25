import type { ReactNode } from 'react'

// Wrap a page that needs a signed-in passenger, such as:
//   <Route path="/bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
export default function RequireAuth({ children }: { children: ReactNode }) {
  // TODO(task 11): read `email` with useAuth(). When nobody is signed in,
  // return <Navigate to="/login" /> (from 'react-router'). Until then, every
  // page is shown.
  return children
}
