/**
 * Removes a single item from an array and returns it.
 * This method mutates the array.
 * @param array The array to splice from.
 * @param index The index of the item which should be spliced.
 * @returns The item which was spliced (removed).
 */
export function removeAt<T>(array: T[], index: number): T {
  if (index < 0 || index >= array.length) return null;

  const len = array.length - 1;
  const item = array[index];

  for (let i = index; i < len; i++) {
    // eslint-disable-next-line no-param-reassign
    array[i] = array[i + 1];
  }

  // eslint-disable-next-line no-param-reassign
  array.length = len;

  return item;
}
