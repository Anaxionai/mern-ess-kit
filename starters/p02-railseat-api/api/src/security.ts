// Passwords and sign-in tokens (task 22).

import type { NextFunction, Request, Response } from "express";

/** An argon2 hash of the password. Never log or store the plain password. */
export async function hashPassword(password: string): Promise<string> {
  throw new Error("TODO(task 22): write hashPassword");
}

/** true when the password matches the hash: argon2.verify(hash, password). */
export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  throw new Error("TODO(task 22): write verifyPassword");
}

/**
 * Middleware for every booking route. Read "Authorization: Bearer <token>", hash it
 * with SHA-256, find a token whose expiresAt is later than now, and put its user in
 * res.locals.user, then call next(). A missing, unknown or expired token: 401 { error }.
 */
export async function currentUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  throw new Error("TODO(task 22): write currentUser");
}
