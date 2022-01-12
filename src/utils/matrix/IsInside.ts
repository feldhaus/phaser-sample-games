/**
 * Checks if the given row and column are inside (valid) a matrix (2d array).
 * @param matrix The matrix (2d array) to be tested.
 * @param row The row to be tested.
 * @param col The column to be tested.
 * @returns Returns true if row and column are valid.
 */
export function isInside<T>(matrix: T[][], row: number, col: number): boolean {
  return row >= 0 && col >= 0 && row < matrix.length && col < matrix[0].length;
}
