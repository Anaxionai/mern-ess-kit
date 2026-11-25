// Finding subscriptions: the same merchant paid about once a month.

import type { Subscription, Transaction } from "./models.ts";

/** Milliseconds in one day: subtract two dates' getTime() and divide by this. */
export const DAY_MS = 24 * 60 * 60 * 1000;

/** true when every gap is between 25 and 35 days. */
export function isMonthly(gaps: number[]): boolean {
  throw new Error("TODO(task 23): write isMonthly");
}

/**
 * Group the debits by merchant in a Map<string, Transaction[]>. For each merchant
 * paid at least 3 times with monthly gaps, make a Subscription: the last amount,
 * the average gap rounded with Math.round, the count, the last date, and the
 * last date plus everyDays * DAY_MS.
 */
export function findRecurring(transactions: Transaction[]): Subscription[] {
  throw new Error("TODO(task 23): write findRecurring");
}
