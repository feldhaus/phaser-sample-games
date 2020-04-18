import 'phaser';
import { Sokoban } from '../game/sokoban';
import { SokobanItem } from '../game/sokoban-item';
import { TileVector } from '../../../math/TileVector';

const SIZE: number = 128;
const TWEEN_DURATION: number = 100;

export class GameScene extends Phaser.Scene {
  private sokoban: Sokoban;
  private staticAssetsContainer: Phaser.GameObjects.Container;
  private movingAssetsContainer: Phaser.GameObjects.Container;
  private player: Phaser.GameObjects.Sprite;
  private crates: Map<SokobanItem, Phaser.GameObjects.Sprite>;
  private currentLevel: number;

  constructor() {
    super({ key: 'Sokoban' });
    this.sokoban = new Sokoban();
    this.crates = new Map<SokobanItem, Phaser.GameObjects.Sprite>();
  }

  protected preload(): void {
    this.load.json('level', './src/games/sokoban/assets/level.json');
    this.load.spritesheet('tiles', './src/games/sokoban/assets/sokoban.png', {
      frameWidth: SIZE,
      frameHeight: SIZE,
    });
  }

  protected create(data: any): void {
    this.currentLevel = data.level || 0;
    const levels = this.cache.json.get('level');
    this.sokoban.buildLevel(levels[this.currentLevel]);

    this.setupBoard();
    this.createLevel();
    this.createPlayer();
    this.createCrates();
    this.handlers();
  }

  private setupBoard(): void {
    const boardWidth = SIZE * this.sokoban.getLevelCols();
    const boardHeight = SIZE * this.sokoban.getLevelRows();
    const { width, height } = this.sys.game.canvas;
    const zoom = Math.min(width / boardWidth, height / boardHeight);
    this.cameras.main.setZoom(zoom);

    const board = this.add.container(
      (width - boardWidth + SIZE) * 0.5,
      (height - boardHeight + SIZE) * 0.5,
    );

    this.staticAssetsContainer = this.add.container(0, 0);
    board.add(this.staticAssetsContainer);
    this.movingAssetsContainer = this.add.container(0, 0);
    board.add(this.movingAssetsContainer);
  }

  private createLevel(): void {
    for (let row = 0; row < this.sokoban.getLevelRows(); row++) {
      for (let col = 0; col < this.sokoban.getLevelCols(); col++) {
        const position = new Phaser.Math.Vector2(col * SIZE, row * SIZE);

        this.staticAssetsContainer.add(
          this.add.sprite(position.x, position.y, 'tiles', 89),
        );

        switch (this.sokoban.getItemAt(row, col)) {
          case Sokoban.WALL:
            this.staticAssetsContainer.add(
              this.add.sprite(position.x, position.y, 'tiles', 98),
            );
            break;
          case Sokoban.GOAL:
            this.staticAssetsContainer.add(
              this.add.sprite(position.x, position.y, 'tiles', 13),
            );
            break;
        }
      }
    }
  }

  private createPlayer(): void {
    const player = this.sokoban.getPlayer();
    this.player = this.add.sprite(
      player.col * SIZE,
      player.row * SIZE,
      'tiles',
      65,
    );
    this.movingAssetsContainer.add(this.player);
  }

  private createCrates(): void {
    this.crates.clear();
    this.sokoban.getCrates().forEach((crate: SokobanItem) => {
      const tile = this.add.sprite(
        crate.col * SIZE,
        crate.row * SIZE,
        'tiles',
        8,
      );
      this.movingAssetsContainer.add(tile);
      this.crates.set(crate, tile);
    });
  }

  private handlers(): void {
    this.input.keyboard.on('keydown-UP', this.moveUp, this);
    this.input.keyboard.on('keydown-DOWN', this.moveDown, this);
    this.input.keyboard.on('keydown-LEFT', this.moveLeft, this);
    this.input.keyboard.on('keydown-RIGHT', this.moveRight, this);
    this.input.keyboard.on('keydown-U', this.undoMove, this);
  }

  private moveUp(): void {
    this.sokoban.moveUp();
    this.handleMovement();
  }

  private moveDown(): void {
    this.sokoban.moveDown();
    this.handleMovement();
  }

  private moveLeft(): void {
    this.sokoban.moveLeft();
    this.handleMovement();
  }

  private moveRight(): void {
    this.sokoban.moveRight();
    this.handleMovement();
  }

  private undoMove(): void {
    this.sokoban.undoMove();
    this.handleMovement();
  }

  private handleMovement(): void {
    this.movePlayer();
    this.moveCrates();
  }

  private movePlayer(): void {
    const player = this.sokoban.getPlayer();

    const direction = player.position.clone();
    direction.sub(player.prevPosition);
    if (direction.equals(TileVector.UP)) {
      this.player.setFrame(68);
    }
    if (direction.equals(TileVector.DOWN)) {
      this.player.setFrame(65);
    }
    if (direction.equals(TileVector.LEFT)) {
      this.player.setFrame(94);
    }
    if (direction.equals(TileVector.RIGHT)) {
      this.player.setFrame(91);
    }

    this.tweens.add({
      targets: this.player,
      x: player.col * SIZE,
      y: player.row * SIZE,
      duration: TWEEN_DURATION,
      ease: 'Linear',
      onComplete: () => {
        if (this.sokoban.isLevelSolved()) {
          this.input.keyboard.removeAllListeners();
          setTimeout(() => {
            this.scene.restart({ level: this.currentLevel + 1 });
            // tslint:disable-next-line: align
          }, 1000);
        }
      },
    });
  }

  private moveCrates(): void {
    this.crates.forEach((sprite, item) => {
      this.tweens.add({
        targets: sprite,
        x: item.col * SIZE,
        y: item.row * SIZE,
        duration: TWEEN_DURATION,
        ease: 'Linear',
      });
    });
  }
}
