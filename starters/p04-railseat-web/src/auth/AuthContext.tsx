import { createContext, useContext, type ReactNode } from 'react'

// Who is signed in, shared with every component inside <AuthProvider>.
// A React context passes values down without props (task 11, step 2).
export type Auth = {
  // The signed-in passenger's email, or null when nobody is signed in.
  email: string | null
  // POST /auth/login, then setToken() from src/api/client.ts. Throws an
  // ApiError with status 401 for a wrong email or password.
  login: (email: string, password: string) => Promise<void>
  // Clear the token and the email, then queryClient.clear(), so the next
  // passenger never sees the last one's cached bookings.
  logout: () => void
}

const AuthContext = createContext<Auth | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO(task 11): keep the email in useState, write login() and logout()
  // (get the QueryClient with useQueryClient()), and return
  // <AuthContext.Provider value={{ email, login, logout }}>{children}</AuthContext.Provider>.
  throw new Error(`TODO(task 11): share sign-in with ${children ? 'the routes' : 'nothing yet'}`)
}

// Read the sign-in state in any component inside <AuthProvider>.
export function useAuth(): Auth {
  const auth = useContext(AuthContext)
  if (auth === null) {
    throw new Error('useAuth() must be used inside <AuthProvider>')
  }
  return auth
}
