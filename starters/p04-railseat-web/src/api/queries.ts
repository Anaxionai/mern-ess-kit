// TanStack Query hooks: every piece of server data the pages use.
// Each hook calls api() from ./client.ts. Write them with useQuery and
// useMutation from '@tanstack/react-query'.
import type { UseQueryResult } from '@tanstack/react-query'
import type { Booking, Seat, TrainResult } from './client'

// Trains from `from` to `to` on `date`: GET /trains/search.
export function useTrainSearch(from: string, to: string, date: string): UseQueryResult<TrainResult[]> {
  // TODO(task 10): useQuery with the key ['search', from, to, date] and a
  // queryFn that calls api(). Choose a staleTime and give your reason in a
  // comment next to it.
  throw new Error(`TODO(task 10): search the trains from ${from} to ${to} on ${date}`)
}

// Every seat of one journey: GET /journeys/:journeyId/seats.
export function useSeats(journeyId: string): UseQueryResult<Seat[]> {
  // TODO(task 10): useQuery with the key ['seats', journeyId], with journeyId
  // exactly as the URL gives it (an ObjectId as text). Choose a staleTime and give your reason in a
  // comment next to it.
  throw new Error(`TODO(task 10): load the seats of journey ${journeyId}`)
}

// Book one seat on this journey: POST /bookings, with the signed-in passenger's token.
export function useBookSeat(journeyId: string) {
  // TODO(task 12): useMutation. Its mutationFn posts
  // { journey_id, seat_id, passenger: { name, age } } to /bookings with api(),
  // which sends your token (task 11).
  // - onSuccess: invalidate ['bookings'], so My bookings shows the new booking.
  // - onSuccess and onError: invalidate ['seats', journeyId], so the map shows
  //   the server's truth, also after a lost race (409).
  throw new Error(`TODO(task 12): book a seat on journey ${journeyId}`)
}

// The signed-in passenger's own bookings: GET /bookings (your API's task 22, P2).
export function useMyBookings(): UseQueryResult<Booking[]> {
  // TODO(task 11): useQuery with the key ['bookings', 'mine'] and a queryFn
  // that calls api<Booking[]>('/bookings'). The token goes with it.
  throw new Error('TODO(task 11): load my bookings')
}
