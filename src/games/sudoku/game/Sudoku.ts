import { createPrefilledMatrix } from '../../../utils/matrix/CreatePrefilledMatrix';
import { isInside } from '../../../utils/matrix/IsInside';
import { fillDiagonal, fillRemaining, removeNumbers } from './SudokuHelper';

export class Sudoku {
  private level: number[][];

  public buildLevel(): void {
    this.level = createPrefilledMatrix(9, 9, 0);
    fillDiagonal(this.level);
    fillRemaining(this.level);
    removeNumbers(this.level, 43);
  }

  public getItemAt(row: number, col: number): number {
    return this.level[row][col];
  }

  public isInside(row: number, col: number): boolean {
    return isInside(this.level, row, col);
  }
}
