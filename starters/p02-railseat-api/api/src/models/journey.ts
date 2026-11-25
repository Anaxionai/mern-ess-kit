// One train running on one date. bookedSeats holds the _id of every booked seat.

import { model, Schema } from "mongoose";

const journeySchema = new Schema({
  // TODO(task 12): the train (its number, or a reference), date as "YYYY-MM-DD"
  //   text, and bookedSeats: an array of seat ObjectIds, empty to start with.
});

// TODO(task 12): the unique key: one journey per train and date, such as
//   journeySchema.index({ trainNumber: 1, date: 1 }, { unique: true }).

export const Journey = model("Journey", journeySchema);
