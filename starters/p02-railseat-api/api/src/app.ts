// The Express app: middleware, routers and the one error handler.
// server.ts starts it; the tests use it with supertest, without a port.

import express from "express";
import type { NextFunction, Request, Response } from "express";
import { authRouter } from "./routes/auth.ts";
import { bookingsRouter } from "./routes/bookings.ts";
import { trainsRouter } from "./routes/trains.ts";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(trainsRouter); // GET /trains/search, GET /journeys/:journeyId/seats (task 18)
app.use(bookingsRouter); // /bookings (tasks 19 and 22)
app.use(authRouter); // /auth/signup and /auth/login (task 22)

// One error handler for the whole app. Express 5 sends it every error that a
// route throws, also from an async route. Every error body is { error }.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // TODO(task 18): answer 404 { error } for NotFound, and 400
  //   { error: "Invalid request", issues: [{ path, message }] } for a ZodError.
  // TODO(task 19): answer 409 { error } for SeatTaken and AlreadyCancelled.
  console.error(err);
  res.status(500).json({
    error: err instanceof Error ? err.message : "Internal server error",
  });
});
