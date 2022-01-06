/**
 * Creates a prefilled matrix (2d array) with a default value.
 * @param rows The number of rows.
 * @param cols The number of cols.
 * @param value The default (start) value.
 * @returns Returns a 2d array filled with a default value.
 */
export function createPrefilledMatrix<T>(rows: number, cols: number, value: T): T[][] {
  const matrix = new Array(rows);
  for (let row = 0; row < rows; row++) {
    matrix[row] = new Array(cols);
    for (let col = 0; col < cols; col++) {
      matrix[row][col] = value;
    }
  }
  return matrix;
  // OR
  // return Array(rows).fill().map(() => Array(columns).fill(value));
}
