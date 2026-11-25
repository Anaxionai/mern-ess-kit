// Sorting each payment into a category, with rules kept in rules.json.

import type { StatementRow } from "./load.ts";

/** Lower-case pattern to category, in file order, such as { "swiggy": "Food delivery" }. */
export type Rules = Record<string, string>;

/** Read rules.json: JSON.parse(await readFile(path, "utf8")). */
export async function loadRules(path: string): Promise<Rules> {
  throw new Error("TODO(task 10): write loadRules");
}

/**
 * The category of the first pattern that the lower-cased narration includes,
 * checked in file order, or "Other" when none match.
 * TODO(task 21): take a Transaction instead of a StatementRow.
 */
export function categorise(tx: StatementRow, rules: Rules): string {
  throw new Error("TODO(task 10): write categorise");
}
