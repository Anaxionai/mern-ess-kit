// A passenger who can sign in, and the tokens they sign in with (task 22).

import { model, Schema } from "mongoose";

const userSchema = new Schema({
  // TODO(task 22): email (unique, lower case), passwordHash and createdAt.
});

const authTokenSchema = new Schema({
  // TODO(task 22): user (a reference), tokenHash (unique) and expiresAt.
});

// TODO(task 22): a TTL index, so MongoDB deletes old tokens:
//   authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }).

export const User = model("User", userSchema);
export const AuthToken = model("AuthToken", authTokenSchema);
