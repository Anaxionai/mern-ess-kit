// Starter checks: ready-made tests for three results that you write.
//
// Each check is skipped until its task. When you finish that task, change
// test.skip to test and run npm test. They only check results. The tests that
// your tasks ask for are still yours to write, in their own files.

import { expect, test } from "vitest";
import { parseDate } from "../src/load.ts";
import { isMonthly } from "../src/recurring.ts";
import { rupees } from "../src/report.ts";

test.skip("TODO(task 9): rupees uses whole paise", () => {
  expect(rupees(125050)).toBe("₹1,250.50");
  expect(rupees(5)).toBe("₹0.05");
});

test.skip("TODO(task 21): parseDate gives midnight UTC on the right day", () => {
  expect(parseDate("05/01/2026").toISOString()).toBe(
    "2026-01-05T00:00:00.000Z",
  );
  expect(parseDate("31/10/2026").getUTCDate()).toBe(31);
});

test.skip("TODO(task 23): isMonthly needs every gap near a month", () => {
  expect(isMonthly([30, 31, 29])).toBe(true);
  expect(isMonthly([30, 12, 31])).toBe(false);
});
