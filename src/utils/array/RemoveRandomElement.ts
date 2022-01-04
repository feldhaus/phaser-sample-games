import { removeAt } from './RemoveAt';

/**
 * Removes a random object from the given array and returns it.
 * This method mutates the array.
 * @param array The array to removed a random element from.
 * @return The random element that was removed.
 */
export function removeRandomElement<T>(array: T[]): T {
  return removeAt(array, Math.floor(Math.random() * array.length));
}
