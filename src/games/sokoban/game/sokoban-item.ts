export class SokobanItem {
  private parent: any;
  private data: any;
  private positionHistory: Phaser.Math.Vector2[];

  constructor(row: number, col: number, parent: any) {
    this.parent = parent;
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

  setData(data: any): void {
    this.data = data;
  }

  getData(): any {
    return this.data;
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

  isOnGoal() {
    return this.parent.isGoalAt(this.position.clone());
  }
}
