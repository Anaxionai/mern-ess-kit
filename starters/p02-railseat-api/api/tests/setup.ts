// Runs before every test file (vitest.config.ts, setupFiles).
// It starts a real MongoDB in memory as a one-node replica set, so transactions
// work, connects Mongoose to it, and stops it at the end.
//
// The first run downloads MongoDB once (about 810 MB) and keeps mongod
// in ~/.cache/mongodb-binaries; package.json's "config" chooses the version.

import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { Booking } from "../src/models/booking.ts";

let replSet: MongoMemoryReplSet;

beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });
  await mongoose.connect(replSet.getUri("railseat_test"));
  // Build the indexes before any request, so MongoDB can refuse a duplicate.
  await Booking.init();
});

beforeEach(async () => {
  // Start every test from an empty database.
  const collections = await mongoose.connection.db!.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
  // TODO(task 20): add one train (one coach with a few seats) and one journey
  //   for the tests to book, with your own models.
});

afterAll(async () => {
  await mongoose.disconnect();
  await replSet?.stop();
});
