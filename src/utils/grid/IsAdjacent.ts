import { Vector2 } from '../../core/Vector2';

/**
 * Checks if two vectors (tiles) are adjacent (diagonal included).
 * @param v1 First vector to compare.
 * @param v2 Second vector to compare.
 * @returns Returns true if they are adjacent.
 */
export function isAdjacent(v1: Vector2, v2: Vector2): boolean {
  return Math.abs(v1.x - v2.x) < 2 && Math.abs(v1.y - v2.y) < 2;
}
