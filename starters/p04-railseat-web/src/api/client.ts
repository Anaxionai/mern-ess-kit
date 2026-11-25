// The RailSeat API from P2. Start the cloud lab's MongoDB, then the API in
// railseat/api/ with:
//   npm run dev
export const BASE_URL = 'http://localhost:3000'

// The sign-in token from POST /auth/login. It lives only in memory, in this
// module, so a reload signs the passenger out (task 11, step 11).
// TODO(task 11): declare it here, for example `let token: string | null = null`.

// Keep the token after log-in, or clear it with null at sign-out.
export function setToken(token: string | null): void {
  // TODO(task 11): store `token` in the module variable above.
  throw new Error(`TODO(task 11): ${token === null ? 'clear' : 'keep'} the token`)
}

// An answer from the API that is not 2xx, with its HTTP status (400, 401, 404, 409 ...).
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// The API's JSON, with the same field names as the types in your API's
// railseat/api/src/schemas.ts. If you changed a type there, change it here.
// Every id is a MongoDB ObjectId sent as text, so it is a string here.

// One journey in the search results (TrainResult).
export type TrainResult = {
  journey_id: string
  train_number: string
  train_name: string
  departs: string // date and time as text, such as "2026-12-01T16:30:00"
  arrives: string
  free_seats: number
}

// One seat of a journey (SeatOut).
export type Seat = {
  seat_id: string
  coach: string // such as "B1"
  travel_class: string // "1A", "2A", "3A", "SL" or "CC"
  number: number
  booked: boolean
}

// One booking (BookingOut).
export type Booking = {
  pnr: string
  status: string // "confirmed" or "cancelled"
  journey_id: string
  travel_date: string // "2026-12-01"
  train_number: string
  train_name: string
  coach: string
  seat_number: number
  passenger_name: string
}

// The body of POST /bookings (BookingIn).
export type BookingIn = {
  journey_id: string
  seat_id: string
  passenger: { name: string; age: number }
}

// Call the API and return its JSON as type T, for example:
//   const trains = await api<TrainResult[]>('/trains/search?from=NDLS&to=BCT&date=2026-12-01')
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  // TODO(task 8): fetch BASE_URL + path with init.
  // - If the response is not ok, throw new ApiError(res.status, ...) with the
  //   API's message as the message: every error body is { error }, and a 400
  //   also has issues: [{ path, message }]. If the body is not JSON, use
  //   res.statusText.
  // - Otherwise return await res.json().
  // - When init has a body, send the header 'Content-Type: application/json'.
  // TODO(task 11): when a token is set, also send 'Authorization: Bearer <token>'.
  throw new Error(`TODO(task 8): fetch ${BASE_URL}${path} (${init?.method ?? 'GET'})`)
}
