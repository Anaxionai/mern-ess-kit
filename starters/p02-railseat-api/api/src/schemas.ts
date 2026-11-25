// Zod schemas for what comes in, and the shapes of what goes out.
// The field names follow the RailSeat API contract that the P4 web app uses.

import { z } from "zod";

/**
 * GET /trains/search: from and to (station codes) and date (z.iso.date()).
 * TODO(task 21): a station-code pattern, from and to different (refine),
 *   limit 1 to 50 (default 20) and offset 0 or more, with z.coerce.number().
 */
export const searchQuery = z.object({
  // TODO(task 18): from, to and date.
});

/** One search result. */
export type TrainResult = {
  journey_id: string;
  train_number: string;
  train_name: string;
  departs: string;
  arrives: string;
  free_seats: number;
};

/** One seat of a journey: seat_id is the seat's ObjectId as text. */
export type SeatOut = {
  seat_id: string;
  coach: string;
  travel_class: string;
  number: number;
  booked: boolean;
};

/**
 * POST /bookings: journey_id and seat_id (each an ObjectId as text, 24 hex
 * characters) and passenger { name, age }.
 * TODO(task 21): name 2 to 60 characters, age a whole number from 1 to 120.
 */
export const bookingIn = z.object({
  // TODO(task 19): journey_id, seat_id and passenger.
});

/** What every booking route answers. */
export type BookingOut = {
  pnr: string;
  status: "confirmed" | "cancelled";
  journey_id: string;
  travel_date: string;
  train_number: string;
  train_name: string;
  coach: string;
  seat_number: number;
  passenger_name: string;
};

/** Turn a Booking document into a BookingOut. */
export function toBookingOut(booking: unknown): BookingOut {
  throw new Error("TODO(task 19): write toBookingOut");
}

/** POST /auth/signup and /auth/login: z.email() and a password of 10 or more characters. */
export const credentialsIn = z.object({
  // TODO(task 22): email and password.
});
