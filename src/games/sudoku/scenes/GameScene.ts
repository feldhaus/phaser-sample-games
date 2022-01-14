import {
  GameObjects, Geom, Input, Scene, Types,
} from 'phaser';
import { Sudoku } from '../game/Sudoku';

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
  private buttons: GameObjects.Container[];
  private tileSize: number;
  private currentRow: number;
  private currentCol: number;

  constructor() {
    super({ key: 'GameScene' });
    this.sudoku = new Sudoku();
  }

  private create(): void {
    this.sudoku.buildLevel();

    this.currentRow = -1;
    this.currentCol = -1;

    this.setupBoard();
    this.createButtons();
    this.createLevel();

    this.inputListener();
  }

  private setupBoard(): void {
    const { width, height } = this.sys.game.canvas;
    const boardSize = Math.min(width, height) - 10;
    this.tileSize = boardSize / Sudoku.SIZE;

    this.board = this.add.container(
      (width - boardSize) * 0.5,
      (height - boardSize) * 0.5,
    );

    this.background = this.add.graphics();
    this.board.add(this.background);

    this.foreground = this.add.graphics();
    this.board.add(this.foreground);

    this.textNumbers = [];
    for (let row = 0; row < Sudoku.SIZE; row++) {
      this.textNumbers.push([]);
      for (let col = 0; col < Sudoku.SIZE; col++) {
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

  private createButtons(): void {
    const { width, height } = this.sys.game.canvas;
    const size = 80;
    const padding = 5;
    const startX = size * 0.5 + (width - (size * 9 + padding * 8)) * 0.5;
    const rect = new Geom.Rectangle(-size * 0.5, -size * 0.5, size, size);

    this.buttons = [];
    for (let i = 0; i < 9; i++) {
      const btn = this.add.container();
      this.buttons.push(btn);
      btn.setPosition(startX + i * (size + padding), height - 100);
      btn.setInteractive(rect, Geom.Rectangle.Contains);

      const background = this.add.graphics();
      btn.add(background);
      background.fillStyle(0x333333);
      background.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, 10);

      const label = this.add.text(0, 0, String(i + 1), { fontSize: '36px', color: '#ffffff' });
      btn.add(label);
      label.setOrigin(0.5, 0.5);
    }
  }

  private createLevel(): void {
    const boardSize = this.tileSize * Sudoku.SIZE;

    this.foreground.beginPath();
    for (let i = 0; i < Sudoku.SIZE + 1; i++) {
      if (i % Sudoku.BOX === 0) {
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

    for (let row = 0; row < Sudoku.SIZE; row++) {
      this.textNumbers.push([]);
      for (let col = 0; col < Sudoku.SIZE; col++) {
        const value = this.sudoku.getItemAt(row, col);
        this.textNumbers[row][col].visible = value !== 0;
        this.textNumbers[row][col].text = String(value);
      }
    }
  }

  private inputListener(): void {
    this.input.on('pointerup', this.handleTap, this);

    const keys = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    for (let i = 0; i < keys.length; i++) {
      const btn = this.buttons[i];

      const keyObj = this.input.keyboard.addKey(keys[i]);
      keyObj.on('down', () => {
        this.setCurrentTileValue(i + 1);
        btn.setScale(0.9);
      });
      keyObj.on('up', () => btn.setScale(1));

      btn
        .on('pointerup', () => {
          this.setCurrentTileValue(i + 1);
          btn.setScale(0.95);
        })
        .on('pointerdown', () => btn.setScale(0.9))
        .on('pointerover', () => btn.setScale(0.95))
        .on('pointerout', () => btn.setScale(1));
    }
  }

  private handleTap(pointer: Input.Pointer): void {
    const col = Math.floor((pointer.x - this.board.x) / this.tileSize);
    const row = Math.floor((pointer.y - this.board.y) / this.tileSize);

    if (!this.sudoku.isAvailable(row, col)) return;

    this.currentRow = row;
    this.currentCol = col;

    this.background.clear();
    this.background.fillStyle(0xe5dee0);

    // draw row
    this.background.fillRect(
      0,
      row * this.tileSize,
      Sudoku.SIZE * this.tileSize,
      this.tileSize,
    );

    // draw col
    this.background.fillRect(
      col * this.tileSize,
      0,
      this.tileSize,
      Sudoku.SIZE * this.tileSize,
    );

    // draw square
    this.background.fillRect(
      Math.floor(col / Sudoku.BOX) * Sudoku.BOX * this.tileSize,
      Math.floor(row / Sudoku.BOX) * Sudoku.BOX * this.tileSize,
      Sudoku.BOX * this.tileSize,
      Sudoku.BOX * this.tileSize,
    );

    // draw current tile
    this.background.fillStyle(0xc3bbc7);
    this.background.fillRect(
      col * this.tileSize,
      row * this.tileSize,
      this.tileSize,
      this.tileSize,
    );
  }

  private setCurrentTileValue(num: number): void {
    if (this.currentRow === -1 || this.currentCol === -1) return;
    this.sudoku.fill(this.currentRow, this.currentCol, num);

    // reset text numbers color
    for (let row = 0; row < Sudoku.SIZE; row++) {
      for (let col = 0; col < Sudoku.SIZE; col++) {
        this.textNumbers[row][col].setColor('#000000');
      }
    }

    // set the used ones color as red
    const used = this.sudoku.getUsed();
    used.forEach((node) => {
      this.textNumbers[node.row][node.col].setColor('#ff0000');
    });

    // set the available ones as blue
    const available = this.sudoku.getAvailable();
    available.forEach((node) => {
      this.textNumbers[node.row][node.col].visible = node.num > 0;
      this.textNumbers[node.row][node.col].text = String(node.num);
      this.textNumbers[node.row][node.col].setColor('#0000ff');
    });
  }
}
