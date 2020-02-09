import 'phaser';

export class Zhed {
  private level: number[][];
  private undoArray: number[][][];
  private selected: Phaser.Math.Vector2;

  static readonly EMPTY = 0;
  static readonly STEP = -1;
  static readonly GOAL = 10;
  static readonly PATH = 11;

  buildLevel(level: number[][]): void {
    this.level = level.concat();
    this.undoArray = [];
    this.selected = new Phaser.Math.Vector2(-1, -1);
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

  getItemAt(row: number, col: number): number;
  getItemAt(position: Phaser.Math.Vector2): number;
  getItemAt(arg1: any, arg2?: any): number {
    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      return this.level[arg1][arg2];
    }
    return this.level[arg1.y][arg1.x];
  }

  isInside(row: number, col: number): boolean {
    return (
      row >= 0 &&
      col >= 0 &&
      row < this.getLevelRows() &&
      col < this.getLevelCols()
    );
  }

  doMove(row: number, col: number): boolean {
    if (!this.isInside(row, col)) return false;

    const value = this.getItemAt(row, col);

    if (value > 0 && value < 10) {
      if (this.selected.x !== -1 && this.selected.y !== -1) {
        this.undoMove();
      }
      this.doSelect(row, col);
    } else if (value === Zhed.STEP) {
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

    this.selected.set(col, row);
    const steps = this.getItemAt(this.selected);

    this.updateValues(this.selected, Phaser.Math.Vector2.UP, steps, Zhed.STEP);
    // prettier-ignore
    this.updateValues(this.selected, Phaser.Math.Vector2.DOWN, steps, Zhed.STEP);
    // prettier-ignore
    this.updateValues(this.selected, Phaser.Math.Vector2.LEFT, steps, Zhed.STEP);
    // prettier-ignore
    this.updateValues(this.selected, Phaser.Math.Vector2.RIGHT, steps, Zhed.STEP);
  }

  private doBuild(row: number, col: number): void {
    this.popHistory();
    this.pushHistory();

    const direction = new Phaser.Math.Vector2(
      col - this.selected.x,
      row - this.selected.y,
    );
    direction.normalize();

    const steps = this.getItemAt(this.selected);

    this.level[this.selected.y][this.selected.x] = Zhed.PATH;
    this.updateValues(this.selected, direction, steps, Zhed.PATH);

    this.selected.set(-1, -1);
  }

  private updateValues(
    position: Phaser.Math.Vector2,
    direction: Phaser.Math.Vector2,
    steps: number,
    newValue: number,
  ): void {
    if (steps === 0) return;

    const nextPosition = new Phaser.Math.Vector2(
      position.x + direction.x,
      position.y + direction.y,
    );

    if (!this.isInside(nextPosition.y, nextPosition.x)) return;

    const value = this.getItemAt(nextPosition);

    if (value === 0 || value === 10) {
      this.level[nextPosition.y][nextPosition.x] = newValue;
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
