import { Vector2 } from '../../../core/Vector2';

export class Zhed {
  private level: number[][];
  private undoArray: number[][][];
  private selected: Vector2;

  public static readonly EMPTY: number = 0;
  public static readonly GOAL: number = 10;
  public static readonly STEP: number = 11;
  public static readonly PATH: number = 12;
  public static readonly LAST: number = 13;

  public buildLevel(level: number[][]): void {
    this.level = this.copyArray(level);
    this.undoArray = [];
  }

  public getLevelRows(): number {
    return this.level.length;
  }

  public getLevelCols(): number {
    return this.level[0].length;
  }

  public isLevelSolved(): boolean {
    return !this.level
      .reduce((acc, val) => acc.concat(val), [])
      .some(value => value === Zhed.GOAL || value === Zhed.STEP);
  }

  public isSelected(): boolean {
    return typeof this.selected !== 'undefined';
  }

  public isInside(row: number, col: number): boolean {
    return (
      row >= 0 &&
      col >= 0 &&
      row < this.getLevelRows() &&
      col < this.getLevelCols()
    );
  }

  public getItemAt(row: number, col: number): number;
  public getItemAt(position: Vector2): number;
  public getItemAt(arg1: any, arg2?: any): number {
    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      return this.level[arg1][arg2];
    }
    return this.level[arg1.y][arg1.x];
  }

  public doMove(row: number, col: number): boolean {
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

  public undoMove(): boolean {
    if (this.undoArray.length > 0) {
      this.popHistory();
    }
    return false;
  }

  private doSelect(row: number, col: number): void {
    this.pushHistory();

    this.selected = new Vector2(col, row);
    const steps = this.getItemAt(this.selected);

    this.updateValues(this.selected, Vector2.UP, steps, Zhed.STEP);
    this.updateValues(this.selected, Vector2.DOWN, steps, Zhed.STEP);
    this.updateValues(this.selected, Vector2.LEFT, steps, Zhed.STEP);
    this.updateValues(this.selected, Vector2.RIGHT, steps, Zhed.STEP);
  }

  private doBuild(row: number, col: number): void {
    this.popHistory();
    this.pushHistory();

    const direction = new Vector2(col, row);
    direction.sub(this.selected);
    direction.normalize();

    const steps = this.getItemAt(this.selected);

    this.level[this.selected.y][this.selected.x] = Zhed.PATH;
    this.updateValues(this.selected, direction, steps, Zhed.PATH);

    this.selected = undefined;
  }

  private updateValues(
    position: Vector2,
    direction: Vector2,
    steps: number,
    newValue: number,
  ): void {
    if (steps === 0) return;

    const nextPosition = Vector2.add(position, direction);

    if (!this.isInside(nextPosition.y, nextPosition.x)) return;

    const value = this.getItemAt(nextPosition);

    if (value === 0 || value === 10) {
      if (newValue === Zhed.STEP && value === 10) {
        this.level[nextPosition.y][nextPosition.x] = Zhed.LAST;
      } else {
        this.level[nextPosition.y][nextPosition.x] = newValue;
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
