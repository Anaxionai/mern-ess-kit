// The PaisaLens data model: a Transaction class and a Subscription.
// Type stripping runs only TypeScript it can erase: no enum and no
// parameter properties (constructor(private x: number)).

/**
 * The eight fields of one transaction.
 * TODO(task 21): add date (a Date), narration, upiRef, merchant and category
 *   (strings), and debitPaise, creditPaise and balancePaise (numbers).
 */
// Delete the next line when the interface has its fields (task 21).
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TransactionData {}

/** One good row of the statement, as a class with its own methods. */
export class Transaction {
  // TODO(task 21): declare the same eight fields here, above the constructor.

  constructor(data: TransactionData) {
    // TODO(task 21): copy each field: this.date = data.date; and so on.
  }

  /** "2026-01" for a date in January 2026: this.date.toISOString().slice(0, 7). */
  month(): string {
    throw new Error("TODO(task 21): write month");
  }

  /** true when money left the account. */
  isDebit(): boolean {
    throw new Error("TODO(task 21): write isDebit");
  }
}

/**
 * A payment that repeats every month.
 * TODO(task 23): add merchant and amountPaise, everyDays and count (numbers),
 *   and lastDate and nextDate (Dates).
 */
// Delete the next line when the interface has its fields (task 23).
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Subscription {}
