/* eslint-disable no-param-reassign */

import { createRange } from '../../../utils/array/CreateRange';
import { removeRandomElement } from '../../../utils/array/RemoveRandomElement';

// check in the row for existence
export function unusedInRow(
  matrix: number[][],
  row: number,
  num: number,
): boolean {
  for (let col = 0; col < 9; col++) {
    if (matrix[row][col] === num) return false;
  }
  return true;
}
// return all same numbers used in this row
export function getUsedInRow(
  matrix: number[][],
  row: number,
  col: number,
  num: number,
): { row: number; col: number }[] {
  const used = [];
  for (let j = 0; j < 9; j++) {
    if (matrix[row][j] === num && col !== j) {
      used.push({ row, col: j });
    }
  }
  return used;
}

// check in the col for existence
export function unusedInCol(
  matrix: number[][],
  col: number,
  num: number,
): boolean {
  for (let row = 0; row < 9; row++) {
    if (matrix[row][col] === num) return false;
  }
  return true;
}

// return all same numbers used in this column
export function getUsedInCol(
  matrix: number[][],
  row: number,
  col: number,
  num: number,
): { row: number; col: number }[] {
  const used = [];
  for (let i = 0; i < 9; i++) {
    if (matrix[i][col] === num && row !== i) {
      used.push({ row: i, col });
    }
  }
  return used;
}

// returns false if given 3 x 3 box contains num
export function unusedInBox(
  matrix: number[][],
  row: number,
  col: number,
  num: number,
): boolean {
  const firstRow = row - (row % 3);
  const firstCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (matrix[firstRow + i][firstCol + j] === num) return false;
    }
  }
  return true;
}

// return all same numbers used in this box
export function getUsedInBox(
  matrix: number[][],
  row: number,
  col: number,
  num: number,
): { row: number; col: number }[] {
  const firstRow = row - (row % 3);
  const firstCol = col - (col % 3);
  const used = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        matrix[firstRow + i][firstCol + j] === num
        && row !== firstRow + i
        && col !== firstCol + j
      ) {
        used.push({ row: firstRow + i, col: firstCol + j });
      }
    }
  }
  return used;
}

// check if safe to put in cell
export function isSafe(
  matrix: number[][],
  row: number,
  col: number,
  num: number,
): boolean {
  return (
    unusedInRow(matrix, row, num)
    && unusedInCol(matrix, col, num)
    && unusedInBox(matrix, row, col, num)
  );
}

// fill a 3 x 3 box
export function fillBox(matrix: number[][], row: number, col: number): void {
  let num = 0;
  // shuffleArray(numberList);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num += 1;
        // num = numberList[Math.floor(Math.random() * numberList.length)];
      } while (!unusedInBox(matrix, row, col, num));

      matrix[row + i][col + j] = num;
    }
  }
}

// fill the diagonal boxes
export function fillDiagonal(matrix: number[][]): void {
  for (let i = 0; i < 9; i += 3) {
    fillBox(matrix, i, i);
  }
}

// a recursive function to fill remaining matrix
export function fillRemaining(
  matrix: number[][],
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
    if (isSafe(matrix, row, col, num)) {
      matrix[row][col] = num;
      if (fillRemaining(matrix, row, col + 1)) return true;
      matrix[row][col] = 0;
    }
  }
  return false;
}

export function removeNumbers(matrix: number[][], amount: number): void {
  const availableCells = createRange(0, 9 * 9);

  while (amount > 0) {
    const cellIndex = removeRandomElement(availableCells);

    const row = Math.floor(cellIndex / 9);
    const col = cellIndex % 9;

    if (matrix[row][col] !== 0) {
      amount -= 1;
      matrix[row][col] = 0;
    }
  }
}
