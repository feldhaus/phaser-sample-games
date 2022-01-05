import { GameObjects, Scene } from 'phaser';
import { Sudoku } from '../game/Sudoku';

const STYLE: any = {
  fontSize: '32px',
  fontFamily: '"Lucida Console", Monaco, monospace',
  fill: '#000000',
  align: 'center',
};

export class GameScene extends Scene {
  private graphics: GameObjects.Graphics;
  private sudoku: Sudoku;

  constructor() {
    super({ key: 'GameScene' });
    this.sudoku = new Sudoku();
  }

  private create(): void {
    this.sudoku.buildLevel();

    this.setupBoard();
  }

  private setupBoard(): void {
    const { width, height } = this.sys.game.canvas;
    const boardSize = Math.min(width, height) - 10;
    const cellSize = boardSize / 9;

    this.graphics = this.add.graphics();
    this.graphics.setPosition(
      (width - boardSize) * 0.5,
      (height - boardSize) * 0.5,
    );

    this.graphics.beginPath();
    for (let i = 0; i < 10; i++) {
      if (i % 3 === 0) {
        this.graphics.lineStyle(2, 0);
      } else {
        this.graphics.lineStyle(1, 0);
      }
      this.graphics.moveTo(0, i * cellSize);
      this.graphics.lineTo(boardSize, i * cellSize);
      this.graphics.moveTo(i * cellSize, 0);
      this.graphics.lineTo(i * cellSize, boardSize);
    }

    this.graphics.closePath();
    this.graphics.strokePath();

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = this.sudoku.getItemAt(row, col);
        if (value === 0) continue;
        const text = this.add.text(0, 0, String(value), STYLE);
        text.setPosition(
          this.graphics.x + col * cellSize + (cellSize - text.width) * 0.5,
          this.graphics.y + row * cellSize + (cellSize - text.height) * 0.5,
        );
      }
    }
  }
}
