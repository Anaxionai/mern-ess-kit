// The app's own errors. Each one means one HTTP status in app.ts's error handler.
//
// TODO(task 18): export class NotFound extends Error {}  (404)
// TODO(task 19): export class SeatTaken and AlreadyCancelled, the same way (409).
//
// They are classes, not an enum: type stripping cannot run an enum.
export {};
