import 'phaser';

const EMPTY = 0;
const WALL = 1;
const PLAYER = 2;
const SPOT = 4;
const CRATE = 8;

export class GameScene extends Phaser.Scene {
  private staticAssetsGroup: Phaser.GameObjects.Container;
  private movingAssetsGroup: Phaser.GameObjects.Container;
  private crates: Phaser.GameObjects.Sprite[][];
  private player: Phaser.GameObjects.Sprite;
  private playerData: { isMoving: boolean; col: number; row: number };
  private level: number[][];
  private currentLevel: number;

  constructor() {
    super({ key: 'Sokoban' });
  }

  protected preload(): void {
    this.load.json('level', '/src/games/sokoban/assets/level.json');
    this.load.spritesheet('tiles', './src/games/sokoban/assets/sokoban.png', {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  protected create(data: any): void {
    this.currentLevel = data.level || 0;
    this.playerData = { isMoving: false, col: 0, row: 0 };
    this.createLevel();
    this.handlers();

  }

  private createLevel(): void {
    const levels = this.cache.json.get('level');
    this.level = levels[this.currentLevel];

    const boardWidth = 128 * 8;
    const boardHeight = 128 * 8;
    const { width, height } = this.sys.game.canvas;
    const zoom = Math.min(width / boardWidth, height / boardHeight);
    this.cameras.main.setZoom(zoom);

    const board = this.add.container(
      (width - boardWidth + 128) * 0.5,
      (height - boardHeight + 128) * 0.5,
    );

    this.staticAssetsGroup = this.add.container(0, 0);
    board.add(this.staticAssetsGroup);
    this.movingAssetsGroup = this.add.container(0, 0);
    board.add(this.movingAssetsGroup);

    this.crates = [];

    for (let i = 0; i < this.level.length; i++) {
      this.crates[i] = [];
      for (let j = 0; j < this.level[i].length; j++) {
        // floor
        const floor = this.add.sprite(128 * j, 128 * i, 'tiles');
        floor.setFrame(89);
        this.staticAssetsGroup.add(floor);

        // tile
        const tile = this.add.sprite(128 * j, 128 * i, 'tiles');

        switch (this.level[i][j]) {
          case WALL:
            tile.setFrame(98);
            this.staticAssetsGroup.add(tile);
            break;
          case PLAYER:
            this.player = tile;
            this.player.setFrame(65);
            this.playerData.col = j;
            this.playerData.row = i;
            this.movingAssetsGroup.add(this.player);
            break;
          case SPOT:
            tile.setFrame(13);
            this.staticAssetsGroup.add(tile);
            break;
          case CRATE:
            tile.setFrame(8);
            this.movingAssetsGroup.add(tile);
            this.crates[i][j] = tile;
        }
      }
    }
  }

  private handlers() {
    this.input.keyboard.on('keydown-UP', this.moveUp, this);
    this.input.keyboard.on('keydown-DOWN', this.moveDown, this);
    this.input.keyboard.on('keydown-LEFT', this.moveLeft, this);
    this.input.keyboard.on('keydown-RIGHT', this.moveRight, this);
  }

  // move player to up
  private moveUp() {
    if (!this.playerData.isMoving) {
      this.handleMovement(0, -1);
      this.player.setFrame(68);
    }
  }

  // move player to down
  private moveDown() {
    if (!this.playerData.isMoving) {
      this.handleMovement(0, 1);
      this.player.setFrame(65);
    }
  }

  // move player to left
  private moveLeft() {
    if (!this.playerData.isMoving) {
      this.handleMovement(-1, 0);
      this.player.setFrame(94);
    }
  }

  // move player to right
  private moveRight() {
    if (!this.playerData.isMoving) {
      this.handleMovement(1, 0);
      this.player.setFrame(91);
    }
  }

  private handleMovement(deltaX, deltaY) {
    if (
      this.isWalkable(
        this.playerData.col + deltaX,
        this.playerData.row + deltaY,
      )
    ) {
      this.movePlayer(deltaX, deltaY);
    } else if (
      this.isCrate(this.playerData.col + deltaX, this.playerData.row + deltaY)
    ) {
      if (
        this.isWalkable(
          this.playerData.col + 2 * deltaX,
          this.playerData.row + 2 * deltaY,
        )
      ) {
        this.moveCrate(deltaX, deltaY);
        this.movePlayer(deltaX, deltaY);
      }
    }
  }

  private isWalkable(posX, posY) {
    return this.level[posY][posX] === EMPTY || this.level[posY][posX] === SPOT;
  }

  private isCrate(posX, posY) {
    return (
      this.level[posY][posX] === CRATE ||
      this.level[posY][posX] === CRATE + SPOT
    );
  }

  private movePlayer(deltaX, deltaY) {
    this.playerData.isMoving = true;

    this.tweens.add({
      targets: this.player,
      x: this.player.x + deltaX * 128,
      y: this.player.y + deltaY * 128,
      duration: 100,
      ease: 'Linear',
      onComplete: () => {
        if (this.isLevelSolved()) {
          this.input.keyboard.removeAllListeners();
          setTimeout(() => {
            this.scene.restart({ level: this.currentLevel + 1 });
          },         1000);
        } else {
          this.playerData.isMoving = false;
        }

        this.level[this.playerData.row][this.playerData.col] -= PLAYER;
        this.playerData.col += deltaX;
        this.playerData.row += deltaY;
        this.level[this.playerData.row][this.playerData.col] += PLAYER;
      },
    });
  }

  private moveCrate(deltaX, deltaY) {
    const crate = this.crates[this.playerData.row + deltaY][this.playerData.col + deltaX];
    this.tweens.add({
      targets: crate,
      x: crate.x + deltaX * 128,
      y: crate.y + deltaY * 128,
      duration: 100,
      ease: 'Linear',
      onComplete: () => {
        this.crates[this.playerData.row + 2 * deltaY][this.playerData.col + 2 * deltaX] = crate;
        this.crates[this.playerData.row + deltaY][this.playerData.col + deltaX] = null;
        this.level[this.playerData.row + deltaY][this.playerData.col + deltaX] -= CRATE;
        this.level[this.playerData.row + 2 * deltaY][this.playerData.col + 2 * deltaX] += CRATE;
      },
    });
  }

  private isLevelSolved() {
    for (let i = 0; i < this.level.length; i++) {
      for (let j = 0; j < this.level[i].length; j++) {
        if (this.level[i][j] === CRATE) {
          return false;
        }
      }
    }
    return true;
  }
}
