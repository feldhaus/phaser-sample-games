import { createPrefilledMatrix } from '../../../utils/matrix/CreatePrefilledMatrix';
import { isInside } from '../../../utils/matrix/IsInside';
import {
  fillDiagonal,
  fillRemaining,
  getUsedInBox,
  getUsedInCol,
  getUsedInRow,
  removeNumbers,
} from './SudokuHelper';

export class Sudoku {
  private level: number[][];
  private interactable: boolean[][];

  public static readonly SIZE: number = 9; // 9 x 9
  public static readonly BOX: number = 3; // 3 x 3

  public buildLevel(): void {
    this.level = createPrefilledMatrix(Sudoku.SIZE, Sudoku.SIZE, 0);

    // fill the board and remove some values
    fillDiagonal(this.level);
    fillRemaining(this.level);
    removeNumbers(this.level, 10);

    // define which cells are interactable (editable)
    this.interactable = [];
    for (let row = 0; row < Sudoku.SIZE; row++) {
      this.interactable[row] = [];
      for (let col = 0; col < Sudoku.SIZE; col++) {
        this.interactable[row][col] = this.level[row][col] === 0;
      }
    }
  }

  public getItemAt(row: number, col: number): number {
    return this.level[row][col];
  }

  public isAvailable(row: number, col: number): boolean {
    return isInside(this.level, row, col) && this.interactable[row][col];
  }

  public fill(row: number, col: number, num: number) {
    this.level[row][col] = num;
  }

  public getAvailable() {
    const available = [];
    for (let row = 0; row < Sudoku.SIZE; row++) {
      for (let col = 0; col < Sudoku.SIZE; col++) {
        if (this.interactable[row][col]) {
          available.push({ row, col, num: this.level[row][col] });
        }
      }
    }
    return available;
  }

  public getUsed() {
    const used = [];
    for (let row = 0; row < Sudoku.SIZE; row++) {
      for (let col = 0; col < Sudoku.SIZE; col++) {
        const num = this.level[row][col];
        if (this.interactable[row][col] && num > 0) {
          used.push(...getUsedInRow(this.level, row, col, num));
          used.push(...getUsedInCol(this.level, row, col, num));
          used.push(...getUsedInBox(this.level, row, col, num));
        }
      }
    }
    return used;
  }
}
