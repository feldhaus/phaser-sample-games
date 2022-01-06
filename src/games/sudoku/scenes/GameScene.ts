import {
  GameObjects, Input, Scene, Types,
} from 'phaser';
import { Sudoku } from '../game/Sudoku';

const CELLS = 9;
const BLOCK = 3;

const STYLE: Types.GameObjects.Text.TextStyle = {
  fontSize: '36px',
  fontFamily: '"Lucida Console", Monaco, monospace',
  color: '#000000',
  align: 'center',
};

export class GameScene extends Scene {
  private sudoku: Sudoku;
  private board: GameObjects.Container;
  private background: GameObjects.Graphics;
  private foreground: GameObjects.Graphics;
  private textNumbers: GameObjects.Text[][];
  private tileSize: number;

  constructor() {
    super({ key: 'GameScene' });
    this.sudoku = new Sudoku();
  }

  private create(): void {
    this.sudoku.buildLevel();

    this.setupBoard();
    this.createLevel();

    this.input.on('pointerup', this.handleTap, this);
  }

  private setupBoard(): void {
    const { width, height } = this.sys.game.canvas;
    const boardSize = Math.min(width, height) - 10;
    this.tileSize = boardSize / CELLS;

    this.board = this.add.container(
      (width - boardSize) * 0.5,
      (height - boardSize) * 0.5,
    );

    this.background = this.add.graphics();
    this.board.add(this.background);

    this.foreground = this.add.graphics();
    this.board.add(this.foreground);

    this.textNumbers = [];
    for (let row = 0; row < CELLS; row++) {
      this.textNumbers.push([]);
      for (let col = 0; col < CELLS; col++) {
        const text = this.add.text(0, 0, '0', STYLE);
        this.textNumbers[row][col] = text;
        this.board.add(text);
        text.setOrigin(0.5, 0.5);
        text.setPosition(
          col * this.tileSize + this.tileSize * 0.5,
          row * this.tileSize + this.tileSize * 0.5,
        );
      }
    }
  }

  private createLevel(): void {
    const boardSize = this.tileSize * CELLS;

    this.foreground.beginPath();
    for (let i = 0; i < CELLS + 1; i++) {
      if (i % BLOCK === 0) {
        this.foreground.lineStyle(3, 0);
      } else {
        this.foreground.lineStyle(1, 0);
      }
      this.foreground.moveTo(0, i * this.tileSize);
      this.foreground.lineTo(boardSize, i * this.tileSize);
      this.foreground.moveTo(i * this.tileSize, 0);
      this.foreground.lineTo(i * this.tileSize, boardSize);
    }
    this.foreground.closePath();
    this.foreground.strokePath();

    for (let row = 0; row < CELLS; row++) {
      this.textNumbers.push([]);
      for (let col = 0; col < CELLS; col++) {
        const value = this.sudoku.getItemAt(row, col);
        this.textNumbers[row][col].visible = value !== 0;
        this.textNumbers[row][col].text = String(value);
      }
    }
  }

  private handleTap(pointer: Input.Pointer): void {
    const col = Math.floor((pointer.x - this.board.x) / this.tileSize);
    const row = Math.floor((pointer.y - this.board.y) / this.tileSize);

    if (!this.sudoku.isInside(row, col)) return;

    this.background.clear();
    this.background.fillStyle(0xe5dee0);

    // draw row
    this.background.fillRect(
      0,
      row * this.tileSize,
      CELLS * this.tileSize,
      this.tileSize,
    );
    // draw col
    this.background.fillRect(
      col * this.tileSize,
      0,
      this.tileSize,
      CELLS * this.tileSize,
    );
    // draw square
    this.background.fillRect(
      Math.floor(col / BLOCK) * BLOCK * this.tileSize,
      Math.floor(row / BLOCK) * BLOCK * this.tileSize,
      BLOCK * this.tileSize,
      BLOCK * this.tileSize,
    );

    // draw cell
    this.background.fillStyle(0xc3bbc7);
    this.background.fillRect(
      col * this.tileSize,
      row * this.tileSize,
      this.tileSize,
      this.tileSize,
    );
  }
}
