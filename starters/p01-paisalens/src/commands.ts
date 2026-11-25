// The PaisaLens commands: import, report and export (task 25).

import { Command } from "commander";
import type { Transaction } from "./models.ts";
import type { ErrorReport } from "./errors.ts";

/**
 * Make an ErrorReport, read the statement, clean and categorise every
 * transaction, and return both.
 */
export async function loadAll(
  statement: string,
): Promise<{ transactions: Transaction[]; report: ErrorReport }> {
  throw new Error("TODO(task 25): write loadAll");
}

/**
 * The commander program `paisalens`, with three commands that each take the
 * statement path: import, report (with --month <month>) and export (with
 * --out <file>, default data/export.csv). Each command calls the functions
 * you already have, never a copy of their code.
 */
export function buildProgram(): Command {
  const program = new Command();
  program
    .name("paisalens")
    .description("Where did the money go? A UPI statement report.");
  // TODO(task 25): add the import, report and export commands, each with an async .action.
  return program;
}
