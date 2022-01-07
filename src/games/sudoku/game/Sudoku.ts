import { createPrefilledMatrix } from '../../../utils/matrix/CreatePrefilledMatrix';
import { isInside } from '../../../utils/matrix/IsInside';
import { fillDiagonal, fillRemaining, removeNumbers } from './SudokuHelper';

export class Sudoku {
  private level: number[][];
  private interactable: boolean[][];

  public static readonly SIZE: number = 9; // 9 x 9
  public static readonly BLOCK: number = 3;

  public buildLevel(): void {
    this.level = createPrefilledMatrix(Sudoku.SIZE, Sudoku.SIZE, 0);

    // fill the board and remove some values
    fillDiagonal(this.level);
    fillRemaining(this.level);
    removeNumbers(this.level, 10);

    // define which cells are interactable (editable)
    this.interactable = [];
    for (let i = 0; i < Sudoku.SIZE; i++) {
      this.interactable[i] = [];
      for (let j = 0; j < Sudoku.SIZE; j++) {
        this.interactable[i][j] = this.level[i][j] === 0;
      }
    }
  }

  public getItemAt(row: number, col: number): number {
    return this.level[row][col];
  }

  public isAvailable(row: number, col: number): boolean {
    return isInside(this.level, row, col) && this.interactable[row][col];
  }
}
