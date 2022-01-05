/**
 * Creates a prefilled grid (2d array) with a default value.
 * @param rows The number of rows.
 * @param cols The number of cols.
 * @param value The default (start) value.
 * @returns Returns a 2d array filled with a default value.
 */
export function createGrid<T>(rows: number, cols: number, value: T): T[][] {
  const grid = new Array(rows);
  for (let row = 0; row < rows; row++) {
    grid[row] = new Array(cols);
    for (let col = 0; col < cols; col++) {
      grid[row][col] = value;
    }
  }
  return grid;
  // OR
  // return Array(rows).fill().map(() => Array(columns).fill(value));
}
