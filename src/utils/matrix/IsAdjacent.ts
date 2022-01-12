/**
 * Checks if the given nodes (row and column) are adjacents.
 * @param a The node to be tested.
 * @param b The node to be tested.
 * @param diagonal If true it will check the diagonals too.
 * @returns Returns true if nodes are adjacents.
 */
export function isAdjacent(
  a: { row: number; col: number },
  b: { row: number; col: number },
  diagonal: boolean = false,
): boolean {
  if (a.row === b.row && a.col === b.col) return false;
  if (diagonal) {
    return Math.abs(a.row - b.row) < 2 && Math.abs(a.col - b.col) < 2;
  }
  return Math.abs(a.row - b.row) < 1 && Math.abs(a.col - b.col) < 1;
}
