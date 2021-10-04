/**
 * A class to describe a two dimensional vector.
 */
export class Vector2 {
  /**
   * X component of the vector.
   */
  public x: number;

  /**
   * Y component of the vector.
   */
  public y: number;

  /**
   * Shorthand for writing Vector2(0, 0).
   */
  static readonly ZERO = new Vector2(0, 0);

  /**
   * Shorthand for writing Vector2(0, -1).
   */
  static readonly UP = new Vector2(0, -1);

  /**
   * Shorthand for writing Vector2(0, 1).
   */
  static readonly DOWN = new Vector2(0, 1);

  /**
   * Shorthand for writing Vector2(-1, 0).
   */
  static readonly LEFT = new Vector2(-1, 0);

  /**
   * Shorthand for writing Vector2(1, 0).
   */
  static readonly RIGHT = new Vector2(1, 0);

  constructor(x: number = 0, y: number = 0) {
    this.set(x, y);
  }

  /**
   * Sets the x and y component of the vector.
   * @param x
   * @param y
   */
  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds a value to the vector or adds it to another vector.
   * @param value A value or vector.
   * @returns Returns the current vector.
   */
  add(value: number | Vector2): Vector2 {
    if (typeof value === 'number') {
      this.set(this.x + value, this.y + value);
    } else {
      this.set(this.x + value.x, this.y + value.y);
    }
    return this;
  }

  /**
   * Subtracts a value from the vector or subtracts it from another vector.
   * @param value A value or vector.
   * @returns Returns the current vector.
   */
  sub(value: number | Vector2): Vector2 {
    if (typeof value === 'number') {
      this.set(this.x - value, this.y - value);
    } else {
      this.set(this.x - value.x, this.y - value.y);
    }
    return this;
  }

  /**
   * Multiplies the vector by a scalar or multiplies it by another vector.
   * @param value A value or vector.
   * @returns Returns the current vector.
   */
  mult(value: number | Vector2): Vector2 {
    if (typeof value === 'number') {
      this.set(this.x * value, this.y * value);
    } else {
      this.set(this.x * value.x, this.y * value.y);
    }
    return this;
  }

  /**
   * Divides the vector by a scalar or divides it by another vector.
   * @param value A value or vector.
   * @returns Returns the current vector.
   */
  div(value: number | Vector2): Vector2 {
    if (typeof value === 'number') {
      this.set(this.x / value, this.y / value);
    } else {
      this.set(this.x / value.x, this.y / value.y);
    }
    return this;
  }

  /**
   * Calculates the magnitude (length) of the vector.
   * @returns Returns the magnitude of the vector.
   */
  mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * Normalize the vector to length 1 (make it a unit vector).
   */
  normalize(): void {
    const mag = this.mag();
    if (mag > 0) {
      this.div(mag);
    }
  }

  /**
   * Returns true if the given vector is exactly equal to this vector.
   * @param vector A vector to be compared.
   * @returns Whether the vector is equal to the given one.
   */
  equals(vector: Vector2): boolean {
    return (
      Math.abs(this.x - vector.x) < Number.EPSILON
      && Math.abs(this.y - vector.y) < Number.EPSILON
    );
  }

  /**
   * Creates a clone of this vector.
   * @returns Returns a clone of this vector.
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Adds two vectors.
   * @param vector1 First vector.
   * @param vector2 Second vector.
   * @returns Returns the sum of vector1 and vector2.
   */
  static add(vector1: Vector2, vector2: Vector2): Vector2 {
    return vector1.clone().add(vector2);
  }

  /**
   * Subtracts two vectors.
   * @param vector1 First vector.
   * @param vector2 Second vector.
   * @returns Returns the difference between vector1 and vector2.
   */
  static sub(vector1: Vector2, vector2: Vector2): Vector2 {
    return vector1.clone().sub(vector2);
  }

  /**
   * Multiplies one vector by the other.
   * @param vector1 First vector.
   * @param vector2 Second vector.
   * @returns Returns a vector containing the scalar dot product of vector1 and vector2.
   */
  static mult(vector1: Vector2, vector2: Vector2): Vector2 {
    return vector1.clone().mult(vector2);
  }

  /**
   * Divides one vector by the other.
   * @param vector1 First vector.
   * @param vector2 Second vector.
   * @returns Returns a vector containing the quotient of the vector1 and vector2.
   */
  static div(vector1: Vector2, vector2: Vector2): Vector2 {
    return vector1.clone().div(vector2);
  }
}
