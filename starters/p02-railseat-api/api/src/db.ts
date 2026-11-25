// The connection to MongoDB, shared by the server, the seed script and the tests.

import mongoose from "mongoose";

/** The cloud lab's replica set. Set MONGODB_URI in the environment to use another. */
export const MONGODB_URI =
  process.env.MONGODB_URI ??
  "mongodb://localhost:27017/railseat?replicaSet=rs0";

/** Connect Mongoose once. A wrong address fails after 10 seconds, not 30. */
export async function connectDb(uri: string = MONGODB_URI): Promise<void> {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
}

/** Close the connection, so a script can end. */
export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
