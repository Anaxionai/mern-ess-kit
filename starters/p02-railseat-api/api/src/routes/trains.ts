// Searching trains and listing a journey's seats (task 18).

import { Router } from "express";

export const trainsRouter = Router();

/**
 * GET /trains/search?from=NDLS&to=BCT&date=2026-12-01
 * Parse req.query with searchQuery, then run your search pipeline with
 * Train.aggregate, using only the parsed values. 200 with TrainResult[].
 */
trainsRouter.get("/trains/search", async (req, res) => {
  throw new Error("TODO(task 18): write GET /trains/search");
});

/**
 * GET /journeys/:journeyId/seats: every seat of the journey's train as a SeatOut,
 * booked when its _id is in bookedSeats. 404 for an unknown or malformed id.
 */
trainsRouter.get("/journeys/:journeyId/seats", async (req, res) => {
  throw new Error("TODO(task 18): write GET /journeys/:journeyId/seats");
});
