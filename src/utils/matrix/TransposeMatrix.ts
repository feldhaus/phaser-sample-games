/**
 * Convert the given matrix into its transpose.
 * A transpose matrix is when the matrix is flipped over its diagonal.
 * The row index of an element becomes the column index and vice-versa.
 * @param matrix The matrix to transpose.
 * @returns Returns a new transposed matrix.
 */
export function transposeMatrix<T>(matrix: T[][]): T[][] {
  const sourceRowCount = matrix.length;
  const sourceColCount = matrix[0].length;

  const newMatrix = new Array(sourceColCount);

  for (let i = 0; i < sourceColCount; i++) {
    newMatrix[i] = new Array(sourceRowCount);

    for (let j = sourceRowCount - 1; j > -1; j--) {
      newMatrix[i][j] = matrix[j][i];
    }
  }

  return newMatrix;
}
