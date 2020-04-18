import { SokobanItem } from './sokoban-item';
import { TileVector } from '../../../math/TileVector';

const STRING_MOVES = 'UDLR';

export class Sokoban {
  private level: number[][];
  private rows: number;
  private cols: number;
  private undoArray: number[][][];
  private moves: string;
  private player: SokobanItem;
  private crates: SokobanItem[];

  static readonly FLOOR: number = 0;
  static readonly WALL: number = 1;
  static readonly PLAYER: number = 2;
  static readonly GOAL: number = 4;
  static readonly CRATE: number = 8;

  buildLevel(level: number[][]): void {
    this.level = this.copyArray(level);
    this.rows = this.level.length;
    this.cols = this.level[0].length;
    this.undoArray = [];
    this.moves = '';
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

  getPlayer(): SokobanItem {
    return this.player;
  }

  getCrates(): SokobanItem[] {
    return this.crates;
  }

  getLevelRows(): number {
    return this.rows;
  }

  getLevelCols(): number {
    return this.cols;
  }

  countCrates(): number {
    return this.crates.length;
  }

  countCratesOnGoal(): number {
    return this.crates.filter(crate => this.isGoalAt(crate.position)).length;
  }

  isLevelSolved(): boolean {
    return this.countCrates() === this.countCratesOnGoal();
  }

  moveLeft(): boolean {
    if (this.canMove(TileVector.LEFT)) {
      return this.doMove(TileVector.LEFT);
    }
    return false;
  }

  moveRight(): boolean {
    if (this.canMove(TileVector.RIGHT)) {
      return this.doMove(TileVector.RIGHT);
    }
    return false;
  }

  moveUp(): boolean {
    if (this.canMove(TileVector.UP)) {
      return this.doMove(TileVector.UP);
    }
    return false;
  }

  moveDown(): boolean {
    if (this.canMove(TileVector.DOWN)) {
      return this.doMove(TileVector.DOWN);
    }
    return false;
  }

  doMove(direction: TileVector): boolean {
    this.pushHistory();

    const step = TileVector.add(this.player.position, direction);

    this.crates.forEach((crate: SokobanItem) => {
      if (crate.position.equals(step)) {
        this.moveCrate(crate, step, TileVector.add(step, direction));
      } else {
        crate.dontMove();
      }
    });

    this.movePlayer(this.player.position, step);

    this.moves += STRING_MOVES.charAt(
      direction.row === 0
        ? direction.col === 1
          ? 3
          : 2
        : direction.row === 1
        ? 1
        : 0,
    );

    return true;
  }

  undoMove(): boolean {
    if (this.undoArray.length > 0) {
      this.popHistory();
      this.moves = this.moves.substring(0, this.moves.length - 1);
      this.player.undoMove();
      this.crates.forEach((crate: SokobanItem) => {
        crate.undoMove();
      });
      return true;
    }
    return false;
  }

  getMoves(): string {
    return this.moves;
  }

  getItemAt(row: number, col: number): number;
  getItemAt(position: TileVector): number;
  getItemAt(arg1: any, arg2?: any): number {
    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      return this.level[arg1][arg2];
    }
    return this.level[arg1.row][arg1.col];
  }

  private isWalkableAt(row: number, col: number): boolean;
  private isWalkableAt(position: TileVector): boolean;
  private isWalkableAt(arg1: any, arg2?: any): boolean {
    return (
      this.getItemAt(arg1, arg2) === Sokoban.FLOOR ||
      this.getItemAt(arg1, arg2) === Sokoban.GOAL
    );
  }

  private isCrateAt(row: number, col: number): boolean;
  private isCrateAt(position: TileVector): boolean;
  private isCrateAt(arg1: any, arg2?: any): boolean {
    return (Sokoban.CRATE & this.getItemAt(arg1, arg2)) === Sokoban.CRATE;
  }

  private isPlayerAt(row: number, col: number): boolean;
  private isPlayerAt(position: TileVector): boolean;
  private isPlayerAt(arg1: any, arg2?: any): boolean {
    return (Sokoban.PLAYER & this.getItemAt(arg1, arg2)) === Sokoban.PLAYER;
  }

  private isGoalAt(row: number, col: number): boolean;
  private isGoalAt(position: TileVector): boolean;
  private isGoalAt(arg1: any, arg2?: any): boolean {
    return (Sokoban.GOAL & this.getItemAt(arg1, arg2)) === Sokoban.GOAL;
  }

  private isPushableCrateAt(
    position: TileVector,
    direction: TileVector,
  ): boolean {
    const movedCrate = TileVector.add(position, direction);
    return this.isCrateAt(position) && this.isWalkableAt(movedCrate);
  }

  private canMove(direction: TileVector): boolean {
    const movedPlayer = TileVector.add(this.player.position, direction);
    return (
      this.isWalkableAt(movedPlayer) ||
      this.isPushableCrateAt(movedPlayer, direction)
    );
  }

  private moveCrate(
    crate: SokobanItem,
    fromPosition: TileVector,
    toPosition: TileVector,
  ): void {
    crate.moveTo(toPosition);
    this.level[fromPosition.row][fromPosition.col] -= Sokoban.CRATE;
    this.level[toPosition.row][toPosition.col] += Sokoban.CRATE;
  }

  private movePlayer(fromPosition: TileVector, toPosition: TileVector): void {
    this.player.moveTo(toPosition);
    this.level[fromPosition.row][fromPosition.col] -= Sokoban.PLAYER;
    this.level[toPosition.row][toPosition.col] += Sokoban.PLAYER;
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
