// One railway station, from the kit's stations.csv.

import { model, Schema } from "mongoose";

const stationSchema = new Schema({
  // TODO(task 12): the fields from docs/model.md, such as code, name, city,
  //   state and zone, with required where a value must be there.
});

// TODO(task 12): the unique key on the station code.

export const Station = model("Station", stationSchema);
