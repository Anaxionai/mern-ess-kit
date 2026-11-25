// The hard problem of P2: two people, one seat (task 20).

import { test } from "vitest";

// TODO(task 20): send 20 POST /bookings for one seat at the same moment, with
//   Promise.all and supertest's request(app). Expect exactly one 201 and 19 409,
//   and the seat once in the journey's bookedSeats.
// TODO(task 22): sign up and log in once, and send Authorization: Bearer <token>
//   with all 20 requests.
test.todo(
  "TODO(task 20): 20 bookings for one seat give one 201 and nineteen 409",
);
