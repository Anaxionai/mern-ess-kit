// Totals for the report: by month, merchant and category, and money as text.

import type { Transaction } from "./models.ts";
import type { StatementRow } from "./load.ts";

/**
 * "05/01/2026" gives "2026-01": year first, so months sort in time order.
 * TODO(task 21): delete monthOf. tx.month() replaces it.
 */
export function monthOf(date: string): string {
  throw new Error("TODO(task 9): write monthOf");
}

/**
 * Month ("2026-01") to the total debitPaise of that month, built in one loop
 * with totals.get(month) ?? 0.
 * TODO(task 21): take Transaction[] and use tx.month().
 */
export function monthlyTotals(rows: StatementRow[]): Map<string, number> {
  throw new Error("TODO(task 9): write monthlyTotals");
}

/** Merchant to total debitPaise. Rows with debitPaise 0 are not spending: skip them. */
export function byMerchant(rows: StatementRow[]): Map<string, number> {
  throw new Error("TODO(task 9): write byMerchant");
}

/**
 * Whole paise as rupee text: rupees(125050) is "₹1,250.50" and rupees(5) is "₹0.05".
 * Use Math.floor, %, toLocaleString("en-IN") and padStart. Never divide into decimals.
 */
export function rupees(paise: number): string {
  throw new Error("TODO(task 9): write rupees");
}

/** Category to total debitPaise. */
export function byCategory(rows: StatementRow[]): Map<string, number> {
  throw new Error("TODO(task 10): write byCategory");
}

/**
 * The month, category and top-merchant totals as one string, one line each:
 * push the lines into an array and return lines.join("\n").
 */
export function renderReport(transactions: Transaction[]): string {
  throw new Error("TODO(task 25): write renderReport");
}
