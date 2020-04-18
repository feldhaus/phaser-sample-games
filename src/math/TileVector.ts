export class TileVector {
  public row: number;
  public col: number;

  static readonly ZERO = new TileVector(0, 0);
  static readonly UP = new TileVector(-1, 0);
  static readonly DOWN = new TileVector(1, 0);
  static readonly LEFT = new TileVector(0, -1);
  static readonly RIGHT = new TileVector(0, 1);

  constructor(row: number, col: number) {
    this.set(row, col);
  }

  set(row: number, col: number): void {
    this.row = row;
    this.col = col;
  }

  add(value: number): TileVector;
  add(value: TileVector): TileVector;
  add(value: any): TileVector {
    if (typeof value === 'number') {
      this.set(this.row + value, this.col + value);
    } else {
      this.set(this.row + value.row, this.col + value.col);
    }
    return this;
  }

  sub(value: number): TileVector;
  sub(value: TileVector): TileVector;
  sub(value: any): TileVector {
    if (typeof value === 'number') {
      this.set(this.row - value, this.col - value);
    } else {
      this.set(this.row - value.row, this.col - value.col);
    }
    return this;
  }

  mult(value: number): TileVector;
  mult(value: TileVector): TileVector;
  mult(value: any): TileVector {
    if (typeof value === 'number') {
      this.set(this.row * value, this.col * value);
    } else {
      this.set(this.row * value.row, this.col * value.col);
    }
    return this;
  }

  div(value: number): TileVector;
  div(value: TileVector): TileVector;
  div(value: any): TileVector {
    if (typeof value === 'number') {
      this.set(this.row / value, this.col / value);
    } else {
      this.set(this.row / value.row, this.col / value.col);
    }
    return this;
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

  clone(): TileVector {
    return new TileVector(this.row, this.col);
  }

  static add(vector1: TileVector, vector2: TileVector): TileVector {
    return vector1.clone().add(vector2);
  }

  static sub(vector1: TileVector, vector2: TileVector): TileVector {
    return vector1.clone().sub(vector2);
  }

  static mult(vector1: TileVector, vector2: TileVector): TileVector {
    return vector1.clone().mult(vector2);
  }

  static div(vector1: TileVector, vector2: TileVector): TileVector {
    return vector1.clone().div(vector2);
  }
}
