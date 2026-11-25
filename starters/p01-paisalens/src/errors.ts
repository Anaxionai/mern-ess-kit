// Bad rows: an error for one row, and a report that lists them all.

/**
 * Thrown by parseRow for one bad row, with a clear reason as its message.
 * TODO(task 24): write it as: export class BadRow extends Error {}
 */

/** One bad row: its line number in the file, the reason and the row itself. */
export type Problem = {
  line: number;
  reason: string;
  row: Record<string, string>;
};

/** Every bad row of one run, written to a CSV file at the end. */
export class ErrorReport {
  problems: Problem[] = [];

  /** Record one bad row. */
  add(line: number, reason: string, row: Record<string, string>): void {
    throw new Error("TODO(task 24): write add");
  }

  /**
   * Write line, reason and row columns to `path` with stringify from
   * "csv-stringify/sync". Turn the row into one text column, such as JSON.stringify(row).
   */
  async writeCsv(path: string): Promise<void> {
    throw new Error("TODO(task 24): write writeCsv");
  }
}
