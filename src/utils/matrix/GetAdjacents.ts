const STRAIGHT = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

const DIAGONAL = [
  { row: -1, col: -1 },
  { row: -1, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 1 },
].concat(STRAIGHT);

/**
 * Returns the adjacent nodes of the given row and column.
 * @param row The initial row.
 * @param col The initial column.
 * @param diagonal If true it will include the diagonals too.
 * @returns Returns an array of adjacent nodes.
 */
export function getAdjacents(
  row: number,
  col: number,
  diagonal: boolean = false,
): { row: number; col: number; }[] {
  const adjacents = [];
  const tiles = diagonal ? DIAGONAL : STRAIGHT;
  for (let i = 0; i < tiles.length; i++) {
    adjacents.push({ row: row + tiles[i].row, col: col + tiles[i].col });
  }
  return adjacents;
}
