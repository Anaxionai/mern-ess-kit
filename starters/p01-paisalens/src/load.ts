// Reading the statement CSV into TypeScript.
//
// The columns are date, narration, upi_ref, debit, credit and balance. The kit's
// data/upi/README.md explains each one, and what is messy on purpose.

import type { Transaction } from "./models.ts";

/** One row as csv-parse gives it with `columns: true`: column name to text. */
export type Row = Record<string, string>;

/**
 * One good row of the statement, with whole-number amounts (task 8).
 * TODO(task 9): add `merchant: string`.
 * TODO(task 10): add `category: string`.
 * TODO(task 21): delete this type. `Transaction` in models.ts replaces it.
 */
export type StatementRow = {
  date: string;
  narration: string;
  upiRef: string;
  debitPaise: number;
  creditPaise: number;
  balancePaise: number;
};

/**
 * Turn rupee text from the statement into whole paise.
 * "119.00" gives 11900 and "64400.00" gives 6440000.
 * An empty amount, "", gives 0: a debit row has an empty credit.
 * Use whole numbers only. Never add rupees with decimals: 0.1 is not exact.
 */
export function toPaise(text: string): number {
  // TODO(task 24): throw new Error(`bad amount '${text}'`) when the result is NaN.
  throw new Error("TODO(task 8): write toPaise");
}

/**
 * Say whether a row is broken and must be skipped.
 * true when debit and credit are both empty, or when an amount is not a
 * number, such as "Rs.855/-". One empty amount is normal. false for a good row.
 */
export function isBroken(row: Row): boolean {
  // TODO(task 21): also return true for a date that cannot exist, such as
  //   31/09/2026: compare parseDate(row.date).getUTCDate() with the day in the text.
  // TODO(task 24): delete isBroken. parseRow throws BadRow instead.
  throw new Error("TODO(task 8): write isBroken");
}

/**
 * Read the statement CSV at `path` and return its good rows.
 * Read the text with readFile, then parse(text, { columns: true }) from
 * "csv-parse/sync". A broken row is not kept and does not stop the program:
 * log "Skipping line N:" and the row. The header is line 1, so row i is line i + 2.
 */
export async function readStatement(path: string): Promise<StatementRow[]> {
  // TODO(task 9): set each row's merchant with cleanMerchant, and skip a row
  //   whose upi_ref you have already kept (keep them in a Set<string>).
  //   An empty upi_ref, as on a salary row, is never a repeat.
  // TODO(task 21): return Promise<Transaction[]>, one parseRow result per good row.
  // TODO(task 24): change it to readStatement(path, report: ErrorReport). Send every
  //   row to parseRow, catch BadRow and call report.add(line, reason, row); rethrow
  //   any other error. A repeat gets the reason "duplicate upi_ref".
  throw new Error("TODO(task 8): write readStatement");
}

/**
 * Turn "21/09/2026" (day/month/year) into a Date at midnight UTC:
 * new Date(Date.UTC(year, month - 1, day)). Months count from 0 in Date.UTC.
 */
export function parseDate(text: string): Date {
  throw new Error("TODO(task 21): write parseDate");
}

/**
 * Turn one CSV row into a Transaction: the date from parseDate, the amounts
 * from toPaise, the merchant from cleanMerchant, and category "".
 */
export function parseRow(row: Row): Transaction {
  // TODO(task 24): throw BadRow with a clear reason for a bad row:
  //   "bad date '31/09/2026'", "no amount" or "bad amount 'Rs.855/-'".
  throw new Error("TODO(task 21): write parseRow");
}
