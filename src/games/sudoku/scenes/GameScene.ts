import {
  GameObjects, Geom, Input, Scene,
} from 'phaser';
import { Sudoku } from '../game/Sudoku';
import {
  BOARD_TEXT_STYLE,
  BOARD_TEXT_STYLE_FILLED,
  BOARD_TEXT_STYLE_USED,
  BTN_COLOR,
  BTN_PADDING,
  BTN_SIZE,
  BTN_TEXT_STYLE,
  GRID_INNER_LINE_COLOR,
  GRID_INNER_LINE_WIDTH,
  GRID_OUTER_LINE_COLOR,
  GRID_OUTER_LINE_WIDTH,
  SELECTED_LINE_COLOR,
  SELECTED_TILE_COLOR,
} from './Style';

const KEYS = [
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
];

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
        const text = this.add.text(0, 0, '0', BOARD_TEXT_STYLE);
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

    const half = BTN_SIZE * 0.5;
    const len = KEYS.length;
    const sx = half + (width - (BTN_SIZE * len + BTN_PADDING * len - 1)) * 0.5;
    const rect = new Geom.Rectangle(-half, -half, BTN_SIZE, BTN_SIZE);

    this.buttons = [];
    for (let i = 0; i < len; i++) {
      const btn = this.add.container();
      this.buttons.push(btn);
      btn.setPosition(sx + i * (BTN_SIZE + BTN_PADDING), height - 100);
      btn.setInteractive(rect, Geom.Rectangle.Contains);

      const background = this.add.graphics();
      btn.add(background);
      background.fillStyle(BTN_COLOR);
      background.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, 10);

      const label = this.add.text(0, 0, String(i + 1), BTN_TEXT_STYLE);
      btn.add(label);
      label.setOrigin(0.5, 0.5);
    }
  }

  private createLevel(): void {
    const boardSize = this.tileSize * Sudoku.SIZE;

    this.foreground.beginPath();
    for (let i = 0; i < Sudoku.SIZE + 1; i++) {
      if (i % Sudoku.BOX === 0) {
        this.foreground.lineStyle(GRID_OUTER_LINE_WIDTH, GRID_OUTER_LINE_COLOR);
      } else {
        this.foreground.lineStyle(GRID_INNER_LINE_WIDTH, GRID_INNER_LINE_COLOR);
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

    for (let i = 0; i < KEYS.length; i++) {
      const btn = this.buttons[i];

      const keyObj = this.input.keyboard.addKey(KEYS[i]);
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
    this.background.fillStyle(SELECTED_LINE_COLOR);

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
    this.background.fillStyle(SELECTED_TILE_COLOR);
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
    this.updateTextNumbers();
  }

  private updateTextNumbers(): void {
    // reset text numbers color
    for (let row = 0; row < Sudoku.SIZE; row++) {
      for (let col = 0; col < Sudoku.SIZE; col++) {
        this.textNumbers[row][col].setColor(BOARD_TEXT_STYLE.color);
      }
    }

    // set the used ones color as red
    const used = this.sudoku.getUsed();
    used.forEach((node) => {
      this.textNumbers[node.row][node.col].setColor(
        BOARD_TEXT_STYLE_FILLED.color,
      );
    });

    // set the available ones as blue
    const available = this.sudoku.getAvailable();
    available.forEach((node) => {
      this.textNumbers[node.row][node.col].visible = node.num > 0;
      this.textNumbers[node.row][node.col].text = String(node.num);
      this.textNumbers[node.row][node.col].setColor(
        BOARD_TEXT_STYLE_USED.color,
      );
    });
  }
}
