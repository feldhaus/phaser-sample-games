/* eslint-disable no-param-reassign */

import { reverseMatrix } from './ReverseMatrix';
import { transposeMatrix } from './TransposeMatrix';

/**
 * Rotates the given matrix.
 * This method mutates the matrix.
 * @param matrix The matrix to rotate.
 * @param direction The rotation direction.
 * @returns Returns a reference to the same matrix (rotated).
 */
export function rotateMatrix<T>(
  matrix: T[][],
  direction: 'left' | 'right',
): T[][] {
  if (direction === 'left') {
    matrix = reverseMatrix(matrix);
    matrix = transposeMatrix(matrix);
  } else if (direction === 'right') {
    matrix = transposeMatrix(matrix);
    matrix = reverseMatrix(matrix);
  }
  return matrix;
  // OR
  // return Utils.Array.Matrix.RotateMatrix(matrix, direction);
}
