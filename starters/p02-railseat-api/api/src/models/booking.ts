// One booking of one seat on one journey, with the passenger embedded.

import { model, Schema } from "mongoose";

const bookingSchema = new Schema({
  // TODO(task 12): pnr, status (an enum: confirmed, cancelled), the journey and
  //   seat ids, the passenger { name, age }, and copies of the train number,
  //   train name, travel date, coach and seat number.
  // TODO(task 22): user, a reference to the User who booked.
});

// TODO(task 12): the unique key on the PNR.
// TODO(task 20): the rule "a seat has at most one confirmed booking per journey":
//   a unique index on journey and seat, with partialFilterExpression on status.

export const Booking = model("Booking", bookingSchema);
