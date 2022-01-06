import { Vector2 } from '../../../core/Vector2';
import { createPrefilledMatrix } from '../../../utils/matrix/CreatePrefilledMatrix';
import { fillDiagonal, fillRemaining, removeNumbers } from './SudokuHelper';

export class Sudoku {
  private level: number[][];

  public buildLevel(): void {
    this.level = createPrefilledMatrix(9, 9, 0);
    fillDiagonal(this.level);
    fillRemaining(this.level);
    removeNumbers(this.level, 10);
  }

  // eslint-disable-next-line no-unused-vars
  public getItemAt(row: number, col: number): number;
  // eslint-disable-next-line no-unused-vars
  public getItemAt(position: Vector2): number;
  public getItemAt(arg1: any, arg2?: any): number {
    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      return this.level[arg1][arg2];
    }
    return this.level[arg1.y][arg1.x];
  }
}
