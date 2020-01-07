import 'phaser';
import { COLOR, int2hex } from '../Color';

const SIZE: number = 60;
const STYLE: any = {
  fontSize: '32px',
  fontFamily: 'Arial',
  color: int2hex(COLOR.DARK_IMPERIAL_BLUE),
  align: 'center',
};

export class Zhed extends Phaser.Scene {
  private cols: number;
  private rows: number;

  private tiles: Phaser.GameObjects.Graphics;
  private steps: Phaser.GameObjects.Graphics;

  private currentLevel: number;

  private grid: number[];

  private offset: Phaser.Geom.Point;
  private selected: Phaser.Geom.Point;

  constructor() {
    super({ key: 'Zhed' });

    this.offset = new Phaser.Geom.Point();
    this.selected = new Phaser.Geom.Point();
  }

  protected preload(): void {
    this.load.json('level', 'assets/zhed/level.json');
  }

  protected create(data: any): void {
    this.currentLevel = data.level || 0;

    this.createLevel();

    this.input.on('pointerup', this.handleTap, this);

    this.add.text(10, 10, this.currentLevel.toString(), {
      fontSize: '36px',
      color: '#ffffff',
    });
  }

  private createLevel(): void {
    const levels = this.cache.json.get('level');
    const level = levels[this.currentLevel];

    this.grid = [];

    this.rows = level.length;
    this.cols = level[0].length;

    this.offset.x = (this.sys.canvas.width - this.cols * SIZE) / 2;
    this.offset.y = (this.sys.canvas.height - this.rows * SIZE) / 2;

    this.tiles = this.add.graphics();
    this.steps = this.add.graphics();

    for (let row = 0; row < level.length; row++) {
      for (let col = 0; col < level[row].length; col++) {
        const px: number = this.offset.x + col * SIZE;
        const py: number = this.offset.y + row * SIZE;

        const value = level[row][col];
        this.grid.push(value);

        if (value > 0 && value < 10) {
          this.tiles.fillStyle(COLOR.MAXIMUM_YELLOW_CARD, 1);
          this.tiles.fillRect(px, py, SIZE, SIZE);
          const txt: Phaser.GameObjects.Text = this.add.text(
            0,
            0,
            value.toFixed(),
            STYLE,
          );
          txt.x = px + (SIZE - txt.width) / 2;
          txt.y = py + (SIZE - txt.height) / 2;
        } else if (value === 10) {
          this.tiles.fillStyle(COLOR.BDAZZLED_BLUE, 1);
          this.tiles.fillRect(px, py, SIZE, SIZE);
          this.tiles.lineStyle(5, COLOR.DARK_TERRA_COTA, 1);
          this.tiles.strokeCircle(px + SIZE / 2, py + SIZE / 2, 20);
        } else {
          this.tiles.fillStyle(COLOR.METALLIC_SEAWEED, 1);
          this.tiles.fillRect(px, py, SIZE, SIZE);
        }

        this.tiles.lineStyle(2, COLOR.DARK_IMPERIAL_BLUE, 1);
        this.tiles.strokeRect(px, py, SIZE, SIZE);

        this.add.text(px + 1, py + 1, `${col},${row}`, {
          fontSize: '12px',
          color: int2hex(COLOR.DARK_IMPERIAL_BLUE),
        });
      }
    }
  }

  private handleTap(pointer: Phaser.Input.Pointer): void {
    const tapCol = Math.floor((pointer.x - this.offset.x) / SIZE);
    const tapRow = Math.floor((pointer.y - this.offset.y) / SIZE);

    if (!this.isInside(tapCol, tapRow)) return;

    this.steps.clear();

    const tileValue = this.getValue(tapCol, tapRow);

    if (tileValue < 0) {
      this.setValue(this.selected.x, this.selected.y, -1);

      const deltaX = Phaser.Math.Clamp(tapCol - this.selected.x, -1, 1);
      const deltaY = Phaser.Math.Clamp(tapRow - this.selected.y, -1, 1);

      this.showMovement(this.selected.x, this.selected.y, deltaX, deltaY);
    }

    this.grid = this.grid.map(v => (v === -1 ? 0 : v === -2 ? 10 : v));

    if (tileValue > 0 && tileValue < 10) {
      this.showSteps(tapCol, tapRow, tileValue, 0, 1);
      this.showSteps(tapCol, tapRow, tileValue, 0, -1);
      this.showSteps(tapCol, tapRow, tileValue, 1, 0);
      this.showSteps(tapCol, tapRow, tileValue, -1, 0);
      this.selected.setTo(tapCol, tapRow);
    }

    if (tileValue === -2 && this.getValue(tapCol, tapRow) === 11) {
      setTimeout(() => {
        this.scene.restart({ level: this.currentLevel + 1 });
      }, 1000);
    }
  }

  private showSteps(
    col: number,
    row: number,
    steps: number,
    deltaCol: number,
    deltaRow: number,
  ): void {
    if (steps === 0) return;

    const stepCol: number = col + deltaCol;
    const stepRow: number = row + deltaRow;

    if (!this.isInside(stepCol, stepRow)) return;

    const tileValue = this.getValue(stepCol, stepRow);

    if (tileValue === 0 || tileValue === 10) {
      this.drawStep(stepCol, stepRow);
      this.showSteps(stepCol, stepRow, steps - 1, deltaCol, deltaRow);
      this.setValue(stepCol, stepRow, tileValue === 10 ? -2 : -1);
    } else {
      this.showSteps(stepCol, stepRow, steps, deltaCol, deltaRow);
    }
  }

  private showMovement(
    col: number,
    row: number,
    deltaCol: number,
    deltaRow: number,
  ): void {
    if (!this.isInside(col, row)) return;

    const tileValue = this.getValue(col, row);

    if (tileValue < 0) {
      const px: number = this.offset.x + col * SIZE;
      const py: number = this.offset.y + row * SIZE;
      this.tiles.fillStyle(COLOR.DARK_TERRA_COTA, 1);
      this.tiles.fillRect(px, py, SIZE, SIZE);
      this.tiles.lineStyle(2, 0x254441, 1);
      this.tiles.strokeRect(px, py, SIZE, SIZE);
      this.setValue(col, row, 11);
    }

    this.showMovement(col + deltaCol, row + deltaRow, deltaCol, deltaRow);
  }

  private setValue(col: number, row: number, value: number): void {
    this.grid[row * this.cols + col] = value;
  }

  private getValue(col: number, row: number): number {
    return this.grid[row * this.cols + col];
  }

  private isInside(col: number, row: number): boolean {
    return row >= 0 && col >= 0 && row < this.rows && col < this.cols;
  }

  private drawStep(col: number, row: number): void {
    const px: number = this.offset.x + col * SIZE;
    const py: number = this.offset.y + row * SIZE;
    this.steps.fillStyle(COLOR.MAXIMUM_YELLOW_CARD, 0.7);
    this.steps.fillCircle(px + SIZE / 2, py + SIZE / 2, 6);
  }
}
