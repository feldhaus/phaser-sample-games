import 'phaser';
import { TileVector } from '../../../math/TileVector';

export class Zhed {
  private level: number[][];
  private undoArray: number[][][];
  private selected: TileVector;

  static readonly EMPTY = 0;
  static readonly GOAL = 10;
  static readonly STEP = 11;
  static readonly PATH = 12;
  static readonly LAST = 13;

  buildLevel(level: number[][]): void {
    this.level = level.concat();
    this.undoArray = [];
  }

  getLevelRows(): number {
    return this.level.length;
  }

  getLevelCols(): number {
    return this.level[0].length;
  }

  isLevelSolved(): boolean {
    return !this.level
      .reduce((acc, val) => acc.concat(val), [])
      .some(value => value === Zhed.GOAL || value === Zhed.STEP);
  }

  isSelected(): boolean {
    return typeof this.selected !== 'undefined';
  }

  isInside(row: number, col: number): boolean {
    return (
      row >= 0 &&
      col >= 0 &&
      row < this.getLevelRows() &&
      col < this.getLevelCols()
    );
  }

  getItemAt(row: number, col: number): number;
  getItemAt(position: TileVector): number;
  getItemAt(arg1: any, arg2?: any): number {
    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      return this.level[arg1][arg2];
    }
    return this.level[arg1.row][arg1.col];
  }

  doMove(row: number, col: number): boolean {
    if (!this.isInside(row, col)) return false;

    const value = this.getItemAt(row, col);

    if (value > 0 && value < 10) {
      if (this.isSelected()) {
        this.undoMove();
      }
      this.doSelect(row, col);
    } else if (value === Zhed.STEP || value === Zhed.LAST) {
      this.doBuild(row, col);
    } else if (value === Zhed.PATH) {
    } else {
      this.undoMove();
    }
  }

  undoMove(): boolean {
    if (this.undoArray.length > 0) {
      this.popHistory();
    }
    return false;
  }

  private doSelect(row: number, col: number): void {
    this.pushHistory();

    this.selected = new TileVector(row, col);
    const steps = this.getItemAt(this.selected);

    this.updateValues(this.selected, TileVector.UP, steps, Zhed.STEP);
    this.updateValues(this.selected, TileVector.DOWN, steps, Zhed.STEP);
    this.updateValues(this.selected, TileVector.LEFT, steps, Zhed.STEP);
    this.updateValues(this.selected, TileVector.RIGHT, steps, Zhed.STEP);
  }

  private doBuild(row: number, col: number): void {
    this.popHistory();
    this.pushHistory();

    const direction = new TileVector(
      row - this.selected.row,
      col - this.selected.col,
    );
    direction.normalize();

    const steps = this.getItemAt(this.selected);

    this.level[this.selected.row][this.selected.col] = Zhed.PATH;
    this.updateValues(this.selected, direction, steps, Zhed.PATH);

    this.selected = undefined;
  }

  private updateValues(
    position: TileVector,
    direction: TileVector,
    steps: number,
    newValue: number,
  ): void {
    if (steps === 0) return;

    const nextPosition = new TileVector(
      position.row + direction.row,
      position.col + direction.col,
    );

    if (!this.isInside(nextPosition.row, nextPosition.col)) return;

    const value = this.getItemAt(nextPosition);

    if (value === 0 || value === 10) {
      if (newValue === Zhed.STEP && value === 10) {
        this.level[nextPosition.row][nextPosition.col] = Zhed.LAST;
      } else {
        this.level[nextPosition.row][nextPosition.col] = newValue;
      }
      this.updateValues(nextPosition, direction, steps - 1, newValue);
    } else {
      this.updateValues(nextPosition, direction, steps, newValue);
    }
  }

  private pushHistory(): void {
    this.undoArray.push(this.copyArray(this.level));
  }

  private popHistory(): void {
    const undoLevel = this.undoArray.pop();
    this.level = this.copyArray(undoLevel);
  }

  private copyArray(array: number[][]): number[][] {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push(array[i].concat());
    }
    return newArray;
  }
}
