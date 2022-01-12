import { getAdjacents } from './GetAdjacents';
import { isInside } from './IsInside';

function isSamePosition(
  a: { row: number; col: number },
  b: { row: number; col: number },
) {
  return a.row === b.row && a.col === b.col;
}

/**
 * Returns all adjacent nodes that match the given row and column (based on the compare function).
 * @param matrix The matrix (2d array).
 * @param row The initial row.
 * @param col The initial column.
 * @param compareFn The function to compare two nodes.
 * @returns Returns an array of nodes.
 */
export function floodFill<T>(
  matrix: T[][],
  row: number,
  col: number,
  // eslint-disable-next-line no-unused-vars
  compareFn: (a: T, b: T) => boolean,
): { row: number; col: number; }[] {
  if (!isInside(matrix, row, col)) return [];

  const frontier = [{ row, col }];
  const array = [{ row, col }];

  while (frontier.length > 0) {
    const current = frontier.pop();
    getAdjacents(current.row, current.col).forEach((next) => {
      if (!isInside(matrix, next.row, next.col)) return;
      if (!compareFn(matrix[next.row][next.col], matrix[row][col])) return;
      if (array.findIndex((item) => isSamePosition(item, next)) !== -1) return;
      frontier.push(next);
      array.push(next);
    });
  }

  return array;
}
