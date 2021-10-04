import { Vector2 } from '../../../core/Vector2';

export class SokobanItem {
  private positionHistory: Vector2[];

  constructor(row: number, col: number) {
    this.positionHistory = [new Vector2(col, row)];
  }

  public get position(): Vector2 {
    return this.positionHistory[this.positionHistory.length - 1];
  }

  public get col(): number {
    return this.position.x;
  }

  public get row(): number {
    return this.position.y;
  }

  public get prevPosition(): Vector2 {
    if (this.positionHistory.length === 1) {
      return this.position;
    }
    return this.positionHistory[this.positionHistory.length - 2];
  }

  public get prevCol(): number {
    return this.prevPosition.x;
  }

  public get prevRow(): number {
    return this.prevPosition.y;
  }

  public hasMoved(): boolean {
    return (
      this.positionHistory.length > 1
      && (this.col !== this.prevCol || this.row !== this.prevRow)
    );
  }

  public moveTo(position: Vector2): void {
    this.positionHistory.push(position.clone());
  }

  public dontMove(): void {
    this.positionHistory.push(this.position.clone());
  }

  public undoMove(): void {
    this.positionHistory.pop();
  }
}
