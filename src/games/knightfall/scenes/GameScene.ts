import { GameObjects, Scene } from 'phaser';
import { Vector2 } from '../../../core/Vector2';
import { KnightFall } from '../game/KnightFall';
import { KnightFallItemType } from '../game/KnightFallItemType';

const BOARD_SIZE: number = 8;
const TILE_SIZE: number = 100;
const COLORS = [6, 7, 20, 21];

export class GameScene extends Scene {
  private knightfall: KnightFall;
  private tileGroup: GameObjects.Container;
  private canPick: boolean;

  constructor() {
    super({ key: 'GameScene' });
    this.knightfall = new KnightFall();
  }

  protected create(): void {
    this.knightfall.buildLevel(8, COLORS);

    this.canPick = true;

    this.setupBoard();
    this.createLevel();
    this.handlers();
  }

  private setupBoard(): void {
    const { width, height } = this.sys.game.canvas;

    // this group will contain all tiles
    this.tileGroup = this.add.container();

    // placing the group in the middle of the canvas
    this.tileGroup.x = width / 2;
    this.tileGroup.y = height / 2;
  }

  private createLevel(): void {
    for (let row = 0; row < this.knightfall.getLevelRows(); row++) {
      for (let col = 0; col < this.knightfall.getLevelCols(); col++) {
        // determining x and y tile position according to tile size
        const offset = (TILE_SIZE * BOARD_SIZE) / 2;
        const position = new Vector2(
          col * TILE_SIZE + TILE_SIZE / 2 - offset,
          row * TILE_SIZE + TILE_SIZE / 2 - offset,
        );

        const sprite = this.add.sprite(position.x, position.y, 'tiles');
        this.tileGroup.add(sprite);
      }
    }

    this.updateSprites();
  }

  private updateSprites(): void {
    const rows = this.knightfall.getLevelRows();
    const cols = this.knightfall.getLevelCols();
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        const sprite = this.tileGroup.getAt(index) as GameObjects.Sprite;
        switch (this.knightfall.getItemAt(row, col).type) {
          case KnightFallItemType.PLAYER:
            sprite.setTexture('character');
            break;
          case KnightFallItemType.KEY:
            sprite.setTexture('tiles');
            sprite.setFrame(66);
            break;
          case KnightFallItemType.DOOR:
            sprite.setTexture('tiles');
            sprite.setFrame(77);
            break;
          case KnightFallItemType.UNLOCKEDDOOR:
            sprite.setTexture('tiles');
            sprite.setFrame(75);
            break;
          default:
            sprite.setTexture('tiles');
            sprite.setFrame(this.knightfall.getItemAt(row, col).value);
            break;
        }
      }
    }
  }

  private handlers(): void {
    this.input.keyboard.on('keydown-LEFT', () => this.rotateBoard(-90), this);
    this.input.keyboard.on('keydown-RIGHT', () => this.rotateBoard(90), this);
  }

  private rotateBoard(angle: number) {
    if (!this.canPick) return;
    this.canPick = false;

    this.tweens.add({
      targets: this.tileGroup,
      angle,
      duration: 500,
      onComplete: () => {
        this.knightfall.rotate(angle > 0 ? 'right' : 'left');
        this.updateSprites();
        this.tileGroup.angle = 0;
        this.canPick = true;
      },
    });
  }
}
