import 'phaser';
import { SokobanItem } from './sokoban-item';

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
    this.level = level.concat();
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
    if (this.canMove(Phaser.Math.Vector2.LEFT)) {
      return this.doMove(Phaser.Math.Vector2.LEFT);
    }
    return false;
  }

  moveRight(): boolean {
    if (this.canMove(Phaser.Math.Vector2.RIGHT)) {
      return this.doMove(Phaser.Math.Vector2.RIGHT);
    }
    return false;
  }

  moveUp(): boolean {
    if (this.canMove(Phaser.Math.Vector2.UP)) {
      return this.doMove(Phaser.Math.Vector2.UP);
    }
    return false;
  }

  moveDown(): boolean {
    if (this.canMove(Phaser.Math.Vector2.DOWN)) {
      return this.doMove(Phaser.Math.Vector2.DOWN);
    }
    return false;
  }

  doMove(direction: Phaser.Math.Vector2): boolean {
    this.pushHistory();

    const step = new Phaser.Math.Vector2(
      this.player.x + direction.x,
      this.player.y + direction.y,
    );

    this.crates.forEach((crate: SokobanItem) => {
      if (crate.x === step.x && crate.y === step.y) {
        this.moveCrate(
          crate,
          step,
          new Phaser.Math.Vector2(step.x + direction.x, step.y + direction.y),
        );
      } else {
        crate.dontMove();
      }
    });

    this.movePlayer(this.player.position, step);

    this.moves += STRING_MOVES.charAt(
      direction.y === 0
        ? direction.x === 1
          ? 3
          : 2
        : direction.y === 1
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
  getItemAt(position: Phaser.Math.Vector2): number;
  getItemAt(arg1: any, arg2?: any): number {
    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      return this.level[arg1][arg2];
    }
    return this.level[arg1.y][arg1.x];
  }

  private isWalkableAt(row: number, col: number): boolean;
  private isWalkableAt(position: Phaser.Math.Vector2): boolean;
  private isWalkableAt(arg1: any, arg2?: any): boolean {
    return (
      this.getItemAt(arg1, arg2) === Sokoban.FLOOR ||
      this.getItemAt(arg1, arg2) === Sokoban.GOAL
    );
  }

  private isCrateAt(row: number, col: number): boolean;
  private isCrateAt(position: Phaser.Math.Vector2): boolean;
  private isCrateAt(arg1: any, arg2?: any): boolean {
    return (Sokoban.CRATE & this.getItemAt(arg1, arg2)) === Sokoban.CRATE;
  }

  private isPlayerAt(row: number, col: number): boolean;
  private isPlayerAt(position: Phaser.Math.Vector2): boolean;
  private isPlayerAt(arg1: any, arg2?: any): boolean {
    return (Sokoban.PLAYER & this.getItemAt(arg1, arg2)) === Sokoban.PLAYER;
  }

  private isGoalAt(row: number, col: number): boolean;
  private isGoalAt(position: Phaser.Math.Vector2): boolean;
  private isGoalAt(arg1: any, arg2?: any): boolean {
    return (Sokoban.GOAL & this.getItemAt(arg1, arg2)) === Sokoban.GOAL;
  }

  private isPushableCrateAt(
    position: Phaser.Math.Vector2,
    direction: Phaser.Math.Vector2,
  ): boolean {
    const movedCrate = new Phaser.Math.Vector2(
      position.x + direction.x,
      position.y + direction.y,
    );
    return this.isCrateAt(position) && this.isWalkableAt(movedCrate);
  }

  private canMove(direction: Phaser.Math.Vector2): boolean {
    const movedPlayer = new Phaser.Math.Vector2(
      this.player.x + direction.x,
      this.player.y + direction.y,
    );
    return (
      this.isWalkableAt(movedPlayer) ||
      this.isPushableCrateAt(movedPlayer, direction)
    );
  }

  private moveCrate(
    crate: SokobanItem,
    fromPosition: Phaser.Math.Vector2,
    toPosition: Phaser.Math.Vector2,
  ): void {
    crate.moveTo(toPosition);
    this.level[fromPosition.y][fromPosition.x] -= Sokoban.CRATE;
    this.level[toPosition.y][toPosition.x] += Sokoban.CRATE;
  }

  private movePlayer(
    fromPosition: Phaser.Math.Vector2,
    toPosition: Phaser.Math.Vector2,
  ): void {
    this.player.moveTo(toPosition);
    this.level[fromPosition.y][fromPosition.x] -= Sokoban.PLAYER;
    this.level[toPosition.y][toPosition.x] += Sokoban.PLAYER;
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
