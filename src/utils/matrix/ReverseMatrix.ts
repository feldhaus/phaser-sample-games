/* eslint-disable no-param-reassign */

/**
 * Reverses the rows of the matrix.
 * This method mutates the matrix.
 * You can use the reverse() function for js/ts instead, but to keep the code
 * more transferable to another language I decided to implement it.
 * @param matrix The matrix to reverse.
 * @returns Returns a reference to the same matrix (reversed).
 */
export function reverseMatrix<T>(matrix: T[][]): T[][] {
  const rows = matrix.length;

  for (let i = 0; i < Math.floor(rows / 2); i++) {
    for (let j = 0; j < rows; j++) {
      const temp = matrix[j][rows - 1 - i];
      matrix[j][rows - 1 - i] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  return matrix;
}
