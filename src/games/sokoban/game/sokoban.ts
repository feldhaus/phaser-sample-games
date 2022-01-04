import cloneDeep from 'lodash.clonedeep';
import { SokobanItem } from './SokobanItem';
import { Vector2 } from '../../../core/Vector2';

export class Sokoban {
  private level: number[][];
  private rows: number;
  private cols: number;
  private undoArray: number[][][];
  private player: SokobanItem;
  private crates: SokobanItem[];

  public static readonly FLOOR: number = 0;
  public static readonly WALL: number = 1;
  public static readonly PLAYER: number = 2;
  public static readonly GOAL: number = 4;
  public static readonly CRATE: number = 8;

  public buildLevel(level: number[][]): void {
    this.level = cloneDeep(level);
    this.rows = this.level.length;
    this.cols = this.level[0].length;
    this.undoArray = [];
    this.crates = [];

    for (let row = 0; row < this.getLevelRows(); row++) {
      for (let col = 0; col < this.getLevelCols(); col++) {
        if (this.isCrateAt(row, col)) {
          this.crates.push(new SokobanItem(row, col));
        }
        if (this.isPlayerAt(row, col)) {
          this.player = new SokobanItem(row, col);
        }
      }
    }
  }

  public getPlayer(): SokobanItem {
    return this.player;
  }

  public getCrates(): SokobanItem[] {
    return this.crates;
  }

  public getLevelRows(): number {
    return this.rows;
  }

  public getLevelCols(): number {
    return this.cols;
  }

  public countCrates(): number {
    return this.crates.length;
  }

  public countCratesOnGoal(): number {
    return this.crates.filter((crate) => this.isGoalAt(crate.position)).length;
  }

  public isLevelSolved(): boolean {
    return this.countCrates() === this.countCratesOnGoal();
  }

  public moveLeft(): boolean {
    if (this.canMove(Vector2.LEFT)) {
      return this.doMove(Vector2.LEFT);
    }
    return false;
  }

  public moveRight(): boolean {
    if (this.canMove(Vector2.RIGHT)) {
      return this.doMove(Vector2.RIGHT);
    }
    return false;
  }

  public moveUp(): boolean {
    if (this.canMove(Vector2.UP)) {
      return this.doMove(Vector2.UP);
    }
    return false;
  }

  public moveDown(): boolean {
    if (this.canMove(Vector2.DOWN)) {
      return this.doMove(Vector2.DOWN);
    }
    return false;
  }

  public doMove(direction: Vector2): boolean {
    this.pushHistory();

    const step = Vector2.add(this.player.position, direction);

    this.crates.forEach((crate: SokobanItem) => {
      if (crate.position.equals(step)) {
        this.moveCrate(crate, step, Vector2.add(step, direction));
      } else {
        crate.dontMove();
      }
    });

    this.movePlayer(this.player.position, step);

    return true;
  }

  public undoMove(): boolean {
    if (this.undoArray.length > 0) {
      this.popHistory();
      this.player.undoMove();
      this.crates.forEach((crate: SokobanItem) => {
        crate.undoMove();
      });
      return true;
    }
    return false;
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

  // eslint-disable-next-line no-unused-vars
  private isWalkableAt(row: number, col: number): boolean;

  // eslint-disable-next-line no-unused-vars
  private isWalkableAt(position: Vector2): boolean;

  private isWalkableAt(arg1: any, arg2?: any): boolean {
    return (
      this.getItemAt(arg1, arg2) === Sokoban.FLOOR
      || this.getItemAt(arg1, arg2) === Sokoban.GOAL
    );
  }

  // eslint-disable-next-line no-unused-vars
  private isCrateAt(row: number, col: number): boolean;

  // eslint-disable-next-line no-unused-vars
  private isCrateAt(position: Vector2): boolean;

  private isCrateAt(arg1: any, arg2?: any): boolean {
    // eslint-disable-next-line no-bitwise
    return (Sokoban.CRATE & this.getItemAt(arg1, arg2)) === Sokoban.CRATE;
  }

  // eslint-disable-next-line no-unused-vars
  private isPlayerAt(row: number, col: number): boolean;

  // eslint-disable-next-line no-unused-vars
  private isPlayerAt(position: Vector2): boolean;

  private isPlayerAt(arg1: any, arg2?: any): boolean {
    // eslint-disable-next-line no-bitwise
    return (Sokoban.PLAYER & this.getItemAt(arg1, arg2)) === Sokoban.PLAYER;
  }

  // eslint-disable-next-line no-unused-vars
  private isGoalAt(row: number, col: number): boolean;

  // eslint-disable-next-line no-unused-vars
  private isGoalAt(position: Vector2): boolean;

  private isGoalAt(arg1: any, arg2?: any): boolean {
    // eslint-disable-next-line no-bitwise
    return (Sokoban.GOAL & this.getItemAt(arg1, arg2)) === Sokoban.GOAL;
  }

  private isPushableCrateAt(position: Vector2, direction: Vector2): boolean {
    const movedCrate = Vector2.add(position, direction);
    return this.isCrateAt(position) && this.isWalkableAt(movedCrate);
  }

  private canMove(direction: Vector2): boolean {
    const movedPlayer = Vector2.add(this.player.position, direction);
    return (
      this.isWalkableAt(movedPlayer)
      || this.isPushableCrateAt(movedPlayer, direction)
    );
  }

  private moveCrate(
    crate: SokobanItem,
    fromPosition: Vector2,
    toPosition: Vector2,
  ): void {
    crate.moveTo(toPosition);
    this.level[fromPosition.y][fromPosition.x] -= Sokoban.CRATE;
    this.level[toPosition.y][toPosition.x] += Sokoban.CRATE;
  }

  private movePlayer(fromPosition: Vector2, toPosition: Vector2): void {
    this.player.moveTo(toPosition);
    this.level[fromPosition.y][fromPosition.x] -= Sokoban.PLAYER;
    this.level[toPosition.y][toPosition.x] += Sokoban.PLAYER;
  }

  private pushHistory(): void {
    this.undoArray.push(cloneDeep(this.level));
  }

  private popHistory(): void {
    const undoLevel = this.undoArray.pop();
    this.level = cloneDeep(undoLevel);
  }
}
