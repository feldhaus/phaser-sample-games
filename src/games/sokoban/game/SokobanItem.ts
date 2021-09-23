import { TileVector } from '../../../math/TileVector';

export class SokobanItem {
  private positionHistory: TileVector[];

  constructor(row: number, col: number) {
    this.positionHistory = [new TileVector(row, col)];
  }

  get position(): TileVector {
    return this.positionHistory[this.positionHistory.length - 1];
  }

  get col(): number {
    return this.position.col;
  }

  get row(): number {
    return this.position.row;
  }

  get prevPosition(): TileVector {
    if (this.positionHistory.length === 1) {
      return this.position;
    }
    return this.positionHistory[this.positionHistory.length - 2];
  }

  get prevCol(): number {
    return this.prevPosition.col;
  }

  get prevRow(): number {
    return this.prevPosition.row;
  }

  hasMoved(): boolean {
    return (
      this.positionHistory.length > 1 &&
      (this.col !== this.prevCol || this.row !== this.prevRow)
    );
  }

  moveTo(position: TileVector): void {
    this.positionHistory.push(position.clone());
  }

  dontMove(): void {
    this.positionHistory.push(this.position.clone());
  }

  undoMove(): void {
    this.positionHistory.pop();
  }
}
