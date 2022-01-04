/**
 * Picks a random item from an array.
 * @param array The array to pick an item.
 * @return Returns a random item.
 */
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
