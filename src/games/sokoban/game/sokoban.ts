import 'phaser';
import { SokobanItem } from './sokoban-item';

const STRING_MOVES = 'UDLR';

export class Sokoban {
  private level: any[];
  private undoArray: any[];
  private moves: string;
  private player: any;
  private crates: any[];
  private undoLevel: any[];

  static readonly FLOOR = 0;
  static readonly WALL = 1;
  static readonly PLAYER = 2;
  static readonly GOAL = 4;
  static readonly CRATE = 8;

  buildLevel(level: number[][]): void {
    this.level = level.concat();
    this.undoArray = [];
    this.moves = '';
    this.crates = [];

    for (let row = 0; row < this.getLevelRows(); row++) {
      for (let col = 0; col < this.getLevelCols(); col++) {
        const position = new Phaser.Math.Vector2(col, row);

        if (this.isCrateAt(position)) {
          this.crates.push(new SokobanItem(position, this));
        }

        if (this.isPlayerAt(position)) {
          this.player = new SokobanItem(position, this);
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

  getItemAt(position: Phaser.Math.Vector2): number {
    return this.level[position.y][position.x];
  }

  getLevelRows(): number {
    return this.level.length;
  }

  getLevelCols(): number {
    return this.level[0].length;
  }

  countCrates(): number {
    return this.crates.length;
  }

  countCratesOnGoal(): number {
    return this.crates.filter(crate => crate.isOnGoal()).length;
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

  isWalkableAt(position: Phaser.Math.Vector2): boolean {
    return (
      this.getItemAt(position) === Sokoban.FLOOR ||
      this.getItemAt(position) === Sokoban.GOAL
    );
  }

  isCrateAt(position: Phaser.Math.Vector2): boolean {
    return (Sokoban.CRATE & this.getItemAt(position)) === Sokoban.CRATE;
  }

  isPlayerAt(position: Phaser.Math.Vector2): boolean {
    return (Sokoban.PLAYER & this.getItemAt(position)) === Sokoban.PLAYER;
  }

  isGoalAt(position: Phaser.Math.Vector2): boolean {
    return (Sokoban.GOAL & this.getItemAt(position)) === Sokoban.GOAL;
  }

  isPushableCrateAt(
    position: Phaser.Math.Vector2,
    direction: Phaser.Math.Vector2,
  ): boolean {
    const movedCrate = new Phaser.Math.Vector2(
      position.x + direction.x,
      position.y + direction.y,
    );
    return this.isCrateAt(position) && this.isWalkableAt(movedCrate);
  }

  canMove(direction: Phaser.Math.Vector2): boolean {
    const movedPlayer = new Phaser.Math.Vector2(
      this.player.x + direction.x,
      this.player.y + direction.y,
    );
    return (
      this.isWalkableAt(movedPlayer) ||
      this.isPushableCrateAt(movedPlayer, direction)
    );
  }

  moveCrate(
    crate: SokobanItem,
    fromPosition: Phaser.Math.Vector2,
    toPosition: Phaser.Math.Vector2,
  ): void {
    crate.moveTo(toPosition);
    this.level[fromPosition.y][fromPosition.x] -= Sokoban.CRATE;
    this.level[toPosition.y][toPosition.x] += Sokoban.CRATE;
  }

  movePlayer(
    fromPosition: Phaser.Math.Vector2,
    toPosition: Phaser.Math.Vector2,
  ): void {
    this.player.moveTo(toPosition);
    this.level[fromPosition.y][fromPosition.x] -= Sokoban.PLAYER;
    this.level[toPosition.y][toPosition.x] += Sokoban.PLAYER;
  }

  doMove(direction: Phaser.Math.Vector2): boolean {
    this.undoArray.push(this.copyArray(this.level));

    const step = new Phaser.Math.Vector2(
      this.player.x + direction.x,
      this.player.y + direction.y,
    );

    this.crates.forEach(crate => {
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
      this.undoLevel = this.undoArray.pop();
      this.level = [];
      this.level = this.copyArray(this.undoLevel);
      this.moves = this.moves.substring(0, this.moves.length - 1);
      this.player.undoMove();
      this.crates.forEach(crate => {
        crate.undoMove();
      });
      return false;
    }
  }

  getMoves(): string {
    return this.moves;
  }

  copyArray(array: any[]): any[] {
    const newArray = array.slice(0);
    for (let i = newArray.length; i > 0; i--) {
      if (newArray[i] instanceof Array) {
        newArray[i] = this.copyArray(newArray[i]);
      }
    }
    return newArray;
  }
}
