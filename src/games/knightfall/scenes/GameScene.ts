import { GameObjects, Input, Scene } from 'phaser';
import { KnightFall } from '../game/KnightFall';
import { KnightFallItemType } from '../game/KnightFallItemType';

const BOARD_SIZE: number = 8;
const TILE_SIZE: number = 100;
const COLORS = [6, 7, 20, 21];

export class GameScene extends Scene {
  private knightfall: KnightFall;
  private board: GameObjects.Container;
  private canPick: boolean;

  constructor() {
    super({ key: 'GameScene' });
    this.knightfall = new KnightFall();
  }

  protected create(): void {
    this.knightfall.buildLevel(BOARD_SIZE, COLORS);

    this.canPick = true;

    this.setupBoard();
    this.createLevel();

    this.inputListener();
  }

  private setupBoard(): void {
    const { width, height } = this.sys.game.canvas;
    this.board = this.add.container(width * 0.5, height * 0.5);

    const size = this.knightfall.getLevelSize();
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const offset = (TILE_SIZE * BOARD_SIZE) / 2;
        const sprite = this.add.sprite(0, 0, 'tiles');
        this.board.add(sprite);
        sprite.setPosition(
          col * TILE_SIZE + TILE_SIZE / 2 - offset,
          row * TILE_SIZE + TILE_SIZE / 2 - offset,
        );
      }
    }
  }

  private createLevel(): void {
    this.updateSprites();
  }

  private updateSprites(): void {
    const size = this.knightfall.getLevelSize();
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const index = row * size + col;
        const sprite = this.board.getAt(index) as GameObjects.Sprite;
        switch (this.knightfall.getItemAt(row, col).type) {
          case KnightFallItemType.EMPTY:
            sprite.visible = false;
            sprite.alpha = 0.2;
            break;
          case KnightFallItemType.PLAYER:
            sprite.visible = true;
            sprite.alpha = 1;
            sprite.setTexture('character');
            break;
          case KnightFallItemType.KEY:
            sprite.visible = true;
            sprite.alpha = 1;
            sprite.setTexture('tiles');
            sprite.setFrame(66);
            break;
          case KnightFallItemType.DOOR:
            sprite.visible = true;
            sprite.alpha = 1;
            sprite.setTexture('tiles');
            sprite.setFrame(77);
            break;
          case KnightFallItemType.UNLOCKEDDOOR:
            sprite.visible = true;
            sprite.alpha = 1;
            sprite.setTexture('tiles');
            sprite.setFrame(75);
            break;
          default:
            sprite.visible = true;
            sprite.alpha = 1;
            sprite.setTexture('tiles');
            sprite.setFrame(this.knightfall.getItemAt(row, col).value);
            break;
        }
      }
    }
  }

  private inputListener(): void {
    this.input.on('pointerup', this.handleTap, this);
    this.input.keyboard.on('keydown-LEFT', () => this.rotateBoard(-90), this);
    this.input.keyboard.on('keydown-RIGHT', () => this.rotateBoard(90), this);
  }

  private handleTap(pointer: Input.Pointer): void {
    if (!this.canPick) return;

    const col = Math.floor((pointer.x - this.board.x) / TILE_SIZE) + BOARD_SIZE * 0.5;
    const row = Math.floor((pointer.y - this.board.y) / TILE_SIZE) + BOARD_SIZE * 0.5;

    const pickedTile = this.knightfall.getItemAt(row, col);
    if (!pickedTile) return;

    const tiles = this.knightfall.selectItemAt(row, col);
    if (tiles.length === 0) return;

    this.canPick = false;

    tiles.forEach((tile) => {
      const index = tile.row * BOARD_SIZE + tile.col;
      const sprite = this.board.getAt(index) as GameObjects.Sprite;
      this.tweens.add({
        targets: sprite,
        alpha: 0,
        duration: 150,
        onComplete: () => {
          if (this.tweens.getAllTweens().every((t) => !t.isPlaying())) {
            this.canPick = true;
            this.updateSprites();
          }
        },
      });
    });
  }

  private rotateBoard(angle: number) {
    if (!this.canPick) return;
    this.canPick = false;

    this.tweens.add({
      targets: this.board,
      angle,
      duration: 500,
      onComplete: () => {
        this.knightfall.rotate(angle > 0 ? 'right' : 'left');
        this.updateSprites();
        this.board.angle = 0;
        this.canPick = true;
      },
    });
  }
}
