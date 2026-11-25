// Load the kit's RailSeat CSV files into MongoDB (task 12).
//
//   npm run seed -- <kit>/data/railseat
//
// <kit> is your course kit's folder (run pwd in it to see its path). The CSV files and
// their columns are explained in the kit's data/railseat/README.md.

import { connectDb, disconnectDb } from "../src/db.ts";

const folder = process.argv[2];
if (!folder) {
  console.error(
    "Give the folder of the CSV files: npm run seed -- <kit>/data/railseat",
  );
  process.exit(1);
}

await connectDb();
try {
  // TODO(task 12): for each model, await Model.init(), so its indexes exist,
  //   then empty it with deleteMany({}), so the seed can run twice.
  // TODO(task 12): read stations.csv, trains.csv, schedules.csv and coaches.csv
  //   from `folder` with csv-parse, as you read CSV files in PaisaLens.
  // TODO(task 12): insert the stations, then the trains: stops sorted by stop_seq,
  //   coaches with one { number } seat per seat, and totalSeats.
  // TODO(task 12): insert one journey per train for each of the next 60 days, with
  //   date as "YYYY-MM-DD" text (d.toLocaleDateString("en-CA")) and empty bookedSeats.
  // TODO(task 12): log how many documents each collection holds.
  throw new Error("TODO(task 12): write the seed script");
} finally {
  await disconnectDb();
}
