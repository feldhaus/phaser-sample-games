import 'phaser';
import { Zhed } from '../game/zhed';

const COLOR = {
  TILES: 0x173f35,
  FONT: 0xf5eaea,
};

const int2hex = (color: number): string => {
  const hex: string = color.toString(16);
  return '#000000'.slice(0, 7 - hex.length) + hex;
};

const STYLE: any = {
  fontSize: '32px',
  fontFamily: '"Lucida Console", Monaco, monospace',
  fill: int2hex(COLOR.FONT),
  align: 'center',
};

export class GameScene extends Phaser.Scene {
  private zhed: Zhed;
  private board: Phaser.GameObjects.Container;
  private tileSize: number;
  private background: Phaser.GameObjects.Graphics;
  private foreground: Phaser.GameObjects.Graphics;
  private currentLevel: number;

  constructor() {
    super({ key: 'Zhed' });
    this.zhed = new Zhed();
  }

  protected preload(): void {
    this.load.json('level', './src/games/zhed/assets/level.json');
  }

  protected create(data: any): void {
    this.currentLevel = data.level || 0;
    const levels = this.cache.json.get('level');
    this.zhed.buildLevel(levels[this.currentLevel]);

    this.setupBoard();
    this.createLevel();

    this.input.on('pointerup', this.handleTap, this);
  }

  private setupBoard(): void {
    const { width, height } = this.sys.game.canvas;
    this.tileSize = width / this.zhed.getLevelCols();
    const boardWidth = this.tileSize * this.zhed.getLevelCols();
    const boardHeight = this.tileSize * this.zhed.getLevelRows();

    this.board = this.add.container(
      (width - boardWidth) * 0.5,
      (height - boardHeight) * 0.5,
    );

    this.background = this.add.graphics();
    this.board.add(this.background);

    this.foreground = this.add.graphics();
    this.board.add(this.foreground);
  }

  private createLevel(): void {
    this.drawBackground();
    this.drawForeground();
  }

  private handleTap(pointer: Phaser.Input.Pointer): void {
    const col = Math.floor((pointer.x - this.board.x) / this.tileSize);
    const row = Math.floor((pointer.y - this.board.y) / this.tileSize);
    this.zhed.doMove(row, col);
    this.drawForeground();

    if (this.zhed.isLevelSolved()) {
      this.input.removeAllListeners();
      setTimeout(() => {
        this.scene.restart({ level: this.currentLevel + 1 });
        // tslint:disable-next-line: align
      }, 1000);
    }
  }

  private drawBackground(): void {
    for (let row = 0; row < this.zhed.getLevelRows(); row++) {
      for (let col = 0; col < this.zhed.getLevelCols(); col++) {
        this.background.fillStyle(COLOR.TILES, 0.1 + Math.random() * 0.3);
        this.background.fillRect(
          col * this.tileSize,
          row * this.tileSize,
          this.tileSize,
          this.tileSize,
        );
      }
    }
  }

  private drawForeground(): void {
    // clear graphics
    this.foreground.clear();

    // remove all tile texts
    this.board.getAll().forEach((go) => {
      if (go instanceof Phaser.GameObjects.Text) {
        go.destroy();
      }
    });

    for (let row = 0; row < this.zhed.getLevelRows(); row++) {
      for (let col = 0; col < this.zhed.getLevelCols(); col++) {
        const position = new Phaser.Math.Vector2(
          col * this.tileSize,
          row * this.tileSize,
        );

        const value = this.zhed.getItemAt(row, col);

        switch (value) {
          case Zhed.GOAL:
            this.drawTile(0xffffff, position, '✕');
            break;
          case Zhed.STEP:
            this.drawStep(COLOR.TILES, position);
            break;
          case Zhed.LAST:
            this.drawTile(COLOR.TILES, position, '✕');
            break;
          case Zhed.EMPTY:
            break;
          case Zhed.PATH:
            this.drawTile(COLOR.TILES, position);
            break;
          default:
            this.drawTile(COLOR.TILES, position, value.toFixed());
        }
      }
    }
  }

  private drawTile(
    color: number,
    position: Phaser.Math.Vector2,
    label?: string,
  ): void {
    this.foreground.fillStyle(0x111111);
    this.foreground.fillRoundedRect(
      position.x,
      position.y,
      this.tileSize,
      this.tileSize,
      5,
    );
    this.foreground.fillStyle(color);
    this.foreground.fillRoundedRect(
      position.x,
      position.y,
      this.tileSize,
      this.tileSize - 5,
      5,
    );

    if (!label) return;

    const text = this.add.text(0, 0, label, STYLE);
    text.x = position.x + (this.tileSize - text.width) * 0.5;
    text.y = position.y + (this.tileSize - text.height) * 0.5 - 2.5;
    this.board.add(text);
  }

  private drawStep(color: number, position: Phaser.Math.Vector2): void {
    this.foreground.fillStyle(color);
    this.foreground.fillCircle(
      position.x + this.tileSize * 0.5,
      position.y + this.tileSize * 0.5,
      5,
    );
  }
}
