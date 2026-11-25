// One train, with its stops and its coaches embedded. Each coach embeds its
// seats as small documents { _id, number }, so every seat has its own id.

import { model, Schema } from "mongoose";

// TODO(task 12): a stop sub-schema (station code, arrival, departure, dayOffset, km),
//   a seat sub-schema ({ number }; Mongoose gives each seat its _id),
//   and a coach sub-schema (code, travel class, seats: [seat sub-schema]).

const trainSchema = new Schema({
  // TODO(task 12): number, name, type, runsOn, stops (sorted by stop_seq),
  //   coaches and totalSeats.
});

// TODO(task 12): the unique key on the train number, and the index on the
//   stops' station codes that search needs: trainSchema.index({ "stops.station": 1 }).

export const Train = model("Train", trainSchema);
