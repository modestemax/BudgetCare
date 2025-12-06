/**
 * Parse a string amount value to a number.
 * Removes spaces and converts to number.
 * Returns NaN if the trimmed value is empty.
 */
export function parseAmount(value: string): number {
  if (value.trim() === "") {
    return NaN;
  }
  // Remove spaces and parse
  return Number(value.replace(/\s/g, ""));
}