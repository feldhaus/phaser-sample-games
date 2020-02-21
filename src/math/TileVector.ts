export class TileVector {
  public row: number;
  public col: number;

  static readonly ZERO = new TileVector(0, 0);
  static readonly LEFT = new TileVector(0, -1);
  static readonly RIGHT = new TileVector(0, 1);
  static readonly UP = new TileVector(-1, 0);
  static readonly DOWN = new TileVector(1, 0);

  constructor(row: number, col: number) {
    this.set(row, col);
  }

  set(row: number, col: number): void {
    this.row = row;
    this.col = col;
  }

  add(value: number): void {
    this.row += value;
    this.col += value;
  }

  sub(value: number): void {
    this.row -= value;
    this.col -= value;
  }

  mult(value: number): void {
    this.row *= value;
    this.col *= value;
  }

  div(value: number): void {
    this.row /= value;
    this.col /= value;
  }

  mag(): number {
    return Math.sqrt(this.col ** 2 + this.row ** 2);
  }

  normalize(): void {
    const mag = this.mag();
    if (mag > 0) {
      this.div(mag);
    }
  }

  equals(tileVector: TileVector): boolean {
    return this.row === tileVector.row && this.col === tileVector.col;
  }
}
