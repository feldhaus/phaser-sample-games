/**
 * Checks if the given row and column for a matrix is inside (valid).
 * @param matrix The matrix (2d array) to be tested.
 * @param row The row to be tested.
 * @param col The column to be tested.
 * @returns Returns if true if row and column are valid.
 */
export function isInside<T>(matrix: T[][], row: number, col: number): boolean {
  return row >= 0 && col >= 0 && row < matrix.length && col < matrix[0].length;
}
