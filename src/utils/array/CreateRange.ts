/**
 * Creates flexibly-numbered lists of integers.
 * @param start The value of the start parameter.
 * @param stop The value of the stop parameter.
 * @param step The value of the step parameter.
 * @returns Returns an array of numbers.
 */
export function createRange(
  start: number,
  stop: number,
  step: number = 1,
): number[] {
  // eslint-disable-next-line no-param-reassign
  if (start > stop) step *= -1;
  const length = Math.floor(Math.abs((stop - start) / step)) + 1;
  const array = Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = start + i * step;
  }
  return array;
  // OR
  // return Array(length).fill().map((_, index) => start + (index * step));
}
