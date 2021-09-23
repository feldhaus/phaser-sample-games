import { Vector2 } from '../../../core/Vector2';

export class SokobanItem {
  private positionHistory: Vector2[];

  constructor(row: number, col: number) {
    this.positionHistory = [new Vector2(col, row)];
  }

  get position(): Vector2 {
    return this.positionHistory[this.positionHistory.length - 1];
  }

  get col(): number {
    return this.position.x;
  }

  get row(): number {
    return this.position.y;
  }

  get prevPosition(): Vector2 {
    if (this.positionHistory.length === 1) {
      return this.position;
    }
    return this.positionHistory[this.positionHistory.length - 2];
  }

  get prevCol(): number {
    return this.prevPosition.x;
  }

  get prevRow(): number {
    return this.prevPosition.y;
  }

  hasMoved(): boolean {
    return (
      this.positionHistory.length > 1 &&
      (this.col !== this.prevCol || this.row !== this.prevRow)
    );
  }

  moveTo(position: Vector2): void {
    this.positionHistory.push(position.clone());
  }

  dontMove(): void {
    this.positionHistory.push(this.position.clone());
  }

  undoMove(): void {
    this.positionHistory.pop();
  }
}
