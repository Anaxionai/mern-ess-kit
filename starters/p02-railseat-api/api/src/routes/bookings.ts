// Booking routes (task 19). From task 22 every one needs a signed-in user.

import { Router } from "express";

export const bookingsRouter = Router();

// TODO(task 22): use currentUser (security.ts) on every booking route, take the
//   user from res.locals.user (never from the body), and add GET /bookings,
//   which returns only that user's bookings. GET and DELETE use getBookingFor.

/** POST /bookings: parse the body with bookingIn, call bookSeat, answer 201. */
bookingsRouter.post("/bookings", async (req, res) => {
  throw new Error("TODO(task 19): write POST /bookings");
});

/** GET /bookings/:pnr: 200 with the booking, or 404. */
bookingsRouter.get("/bookings/:pnr", async (req, res) => {
  throw new Error("TODO(task 19): write GET /bookings/:pnr");
});

/** DELETE /bookings/:pnr: 200 with the cancelled booking, 404, or 409 if cancelled already. */
bookingsRouter.delete("/bookings/:pnr", async (req, res) => {
  throw new Error("TODO(task 19): write DELETE /bookings/:pnr");
});
