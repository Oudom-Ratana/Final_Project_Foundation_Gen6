/**
 * seatLayoutData.js
 * Configurations, prices, and constants for cinema seat selection
 */

export const GOLD_PRICE = 11.0;
export const STANDARD_SINGLE_PRICE = 5.0;
export const STANDARD_COUPLE_PRICE = 10.0;

// Gold Class Seat Grid Definition: 6 Rows (F down to A), 6 Cols (1-2, 3-4, 5-6)
export const GOLD_ROWS = ["F", "E", "D", "C", "B", "A"];
export const GOLD_COL_GROUPS = [
  [1, 2],
  [3, 4],
  [5, 6],
];

// Standard Hall Seat Grid Definition: 8 Rows (H down to A)
export const STANDARD_ROWS = ["H", "G", "F", "E", "D", "C", "B", "A"];
export const STANDARD_COL_GROUPS = [
  [1, 2],
  [3, 4, 5, 6, 7, 8, 9, 10],
  [11, 12],
];

// Row A Couple Seat Pairs (5 evenly balanced pairs)
export const COUPLE_PAIRS = [
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
  [9, 10],
];

export const getCouplePair = (col) =>
  COUPLE_PAIRS.find((p) => p.includes(col)) ||
  (col === 11 || col === 12 ? [9, 10] : null);

// Realistic default reserved seats matching mockups
export const DEFAULT_GOLD_RESERVED = new Set([
  "F1",
  "F2",
  "F3",
  "F4",
  "E1",
  "E2",
  "E3",
  "E4",
  "D1",
  "D2",
  "C1",
  "C2",
  "B1",
  "B2",
  "B3",
  "B4",
  "A1",
  "A2",
  "A3",
  "A4",
]);

export const DEFAULT_STANDARD_RESERVED = new Set([
  "H1",
  "H2",
  "G1",
  "G2",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "E1",
  "E2",
  "E3",
  "E4",
  "E5",
  "E6",
  "E7",
  "E8",
  "E11",
  "E12",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D11",
  "D12",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C11",
  "C12",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B11",
  "B12",
  "A1",
  "A2",
  "A3",
  "A4",
  "A7",
  "A8",
]);
