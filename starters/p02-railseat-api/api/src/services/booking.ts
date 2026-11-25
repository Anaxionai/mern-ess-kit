// Booking a seat, reading a booking and cancelling it.

import type { BookingOut } from "../schemas.ts";

/** A new PNR: 10 characters, each picked with crypto.randomInt from A to Z and 0 to 9. */
export function newPnr(): string {
  throw new Error("TODO(task 19): write newPnr");
}

/**
 * Book one seat for one passenger. Throw NotFound for an unknown journey or a seat
 * that is not on its train, and SeatTaken when the seat is booked already.
 * Then add the seat to the journey's bookedSeats and create a confirmed Booking.
 */
export async function bookSeat(data: unknown): Promise<BookingOut> {
  // TODO(task 20): claim the seat with one conditional Journey.updateOne(
  //   { _id, bookedSeats: { $ne: seatId } }, { $push: ... }) (matchedCount 0 means
  //   SeatTaken), turn error code 11000 into SeatTaken, and run the update and
  //   Booking.create([...], { session }) in mongoose.connection.transaction(...).
  // TODO(task 22): take the user as a parameter, and save it on the booking.
  throw new Error("TODO(task 19): write bookSeat");
}

/** The booking with this PNR, or NotFound. */
export async function getBooking(pnr: string): Promise<BookingOut> {
  throw new Error("TODO(task 19): write getBooking");
}

/**
 * Cancel in one transaction: NotFound if there is no booking, AlreadyCancelled if
 * it is cancelled. Set status "cancelled" (keep the document) and $pull the seat
 * from the journey's bookedSeats. Pass { session } to every write.
 */
export async function cancelBooking(pnr: string): Promise<BookingOut> {
  throw new Error("TODO(task 19): write cancelBooking");
}

/** The user's own booking with this PNR. Another user's PNR is NotFound (404), never 403. */
export async function getBookingFor(
  user: unknown,
  pnr: string,
): Promise<BookingOut> {
  throw new Error("TODO(task 22): write getBookingFor");
}
