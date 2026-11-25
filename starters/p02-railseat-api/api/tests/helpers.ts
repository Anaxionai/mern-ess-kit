// Helpers for the tests.

/**
 * Sign up and log in a test passenger with supertest, and return the token for
 * "Authorization: Bearer <token>". Argon2 is slow on purpose: call it once per
 * test, not once per request.
 */
export async function signUpAndLogIn(email: string): Promise<string> {
  throw new Error("TODO(task 22): write signUpAndLogIn");
}
