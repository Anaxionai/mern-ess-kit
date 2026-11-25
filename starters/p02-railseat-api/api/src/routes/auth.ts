// Sign-up and log-in (task 22).

import { Router } from "express";

export const authRouter = Router();

/**
 * POST /auth/signup { email, password }: lower-case the email, store only the
 * argon2 hash, answer 201 { id, email }. A taken email (code 11000) is 409.
 */
authRouter.post("/auth/signup", async (req, res) => {
  throw new Error("TODO(task 22): write POST /auth/signup");
});

/**
 * POST /auth/login { email, password }: the same 401 for a wrong email and a wrong
 * password. Otherwise make a token with crypto.randomBytes(32).toString("base64url"),
 * save only its SHA-256 hash with a 24-hour expiresAt, and answer 200
 * { access_token: <token>, token_type: "bearer" }.
 */
authRouter.post("/auth/login", async (req, res) => {
  throw new Error("TODO(task 22): write POST /auth/login");
});
