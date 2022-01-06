/* eslint-disable no-param-reassign */

import { createRange } from '../../../utils/array/CreateRange';
import { removeRandomElement } from '../../../utils/array/RemoveRandomElement';

// check in the row for existence
export function unusedInRow(
  grid: number[][],
  row: number,
  num: number,
): boolean {
  for (let col = 0; col < 9; col++) {
    if (grid[row][col] === num) return false;
  }
  return true;
}

// check in the col for existence
export function unusedInCol(
  grid: number[][],
  col: number,
  num: number,
): boolean {
  for (let row = 0; row < 9; row++) {
    if (grid[row][col] === num) return false;
  }
  return true;
}

// returns false if given 3 x 3 box contains num
export function unusedInBox(
  grid: number[][],
  row: number,
  col: number,
  num: number,
): boolean {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[row + i][col + j] === num) return false;
    }
  }

  return true;
}

// check if safe to put in cell
export function isSafe(
  grid: number[][],
  row: number,
  col: number,
  num: number,
): boolean {
  return (
    unusedInRow(grid, row, num)
    && unusedInCol(grid, col, num)
    && unusedInBox(grid, row - (row % 3), col - (col % 3), num)
  );
}

// fill a 3 x 3 box
export function fillBox(grid: number[][], row: number, col: number): void {
  let num = 0;
  // shuffleArray(numberList);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num += 1;
        // num = numberList[Math.floor(Math.random() * numberList.length)];
      } while (!unusedInBox(grid, row, col, num));

      grid[row + i][col + j] = num;
    }
  }
}

// fill the diagonal boxes
export function fillDiagonal(grid: number[][]): void {
  for (let i = 0; i < 9; i += 3) {
    fillBox(grid, i, i);
  }
}

// a recursive function to fill remaining matrix
export function fillRemaining(
  grid: number[][],
  row: number = 0,
  col: number = 0,
): boolean {
  if (col >= 9 && row < 8) {
    row += 1;
    col = 0;
  }

  if (row >= 9 && col >= 9) {
    return true;
  }

  // const rowBox = Math.floor(row / 3);
  // const colBox = Math.floor(col / 3);

  // if (rowBox === 0 && colBox === 0) {
  //     col = 3;
  // } else if (rowBox === 1 && colBox === 1) {
  //     col += 3;
  // } else if (rowBox === 2 && colBox === 2) {
  //     row++;
  //     col = 0;
  //     if (row >= 9) return true;
  // }

  // skip diagonal boxes
  if (row < 3) {
    if (col < 3) col = 3;
  } else if (row < 6) {
    if (col === Math.floor(row / 3) * 3) col += 3;
  } else if (col === 6) {
    row += 1;
    col = 0;
    if (row >= 9) return true;
  }

  for (let num = 1; num <= 9; num++) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (fillRemaining(grid, row, col + 1)) return true;
      grid[row][col] = 0;
    }
  }
  return false;
}

export function removeNumbers(grid: number[][], amount: number): void {
  const availableCells = createRange(0, 9 * 9);

  while (amount > 0) {
    const cellIndex = removeRandomElement(availableCells);

    const row = Math.floor(cellIndex / 9);
    const col = cellIndex % 9;

    if (grid[row][col] !== 0) {
      amount -= 1;
      grid[row][col] = 0;
    }
  }
}
