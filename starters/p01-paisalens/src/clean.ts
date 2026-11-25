// Cleaning merchant names out of the bank's narration text.

/**
 * Names that no pattern can link to the brand, such as a company's legal name.
 * TODO(task 22): fill it, for example { "Bundl Technologies": "Swiggy" }, and apply it last.
 */
export const ALIASES: Record<string, string> = {};

/**
 * The merchant's name in one narration.
 * Task 9: split on "/" and return part 3, trimmed and in upper case; with
 * fewer than 4 parts, return the whole narration trimmed.
 * "UPI/DR/624513611097/BIGBASKET/ICIC/bbdaily@icici/UPI" gives "BIGBASKET".
 */
export function cleanMerchant(narration: string): string {
  // TODO(task 22): capture the merchant part of each of the five layouts with a
  //   regular expression group, remove noise (LIMITED, LTD, PVT, .com, digits) with
  //   replace and the g and i flags, return title case, then apply ALIASES.
  throw new Error("TODO(task 9): write cleanMerchant");
}
