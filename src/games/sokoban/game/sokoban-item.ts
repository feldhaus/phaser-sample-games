export class SokobanItem {
  private positionHistory: Phaser.Math.Vector2[];

  constructor(row: number, col: number) {
    this.positionHistory = [new Phaser.Math.Vector2(col, row)];
  }

  get position(): Phaser.Math.Vector2 {
    return this.positionHistory[this.positionHistory.length - 1];
  }

  get x(): number {
    return this.position.x;
  }

  get y(): number {
    return this.position.y;
  }

  get prevPosition(): Phaser.Math.Vector2 {
    if (this.positionHistory.length === 1) {
      return this.position;
    }
    return this.positionHistory[this.positionHistory.length - 2];
  }

  get prevX(): number {
    return this.prevPosition.x;
  }

  get prevY(): number {
    return this.prevPosition.y;
  }

  hasMoved(): boolean {
    return (
      this.positionHistory.length > 1 &&
      (this.x !== this.prevX || this.y !== this.prevY)
    );
  }

  moveTo(position: Phaser.Math.Vector2): void {
    this.positionHistory.push(position.clone());
  }

  dontMove(): void {
    this.positionHistory.push(this.position.clone());
  }

  undoMove(): void {
    this.positionHistory.pop();
  }
}
