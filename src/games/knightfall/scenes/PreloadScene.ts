import { Scene } from 'phaser';

const PLAYER_FRAME_SIZE: number = 96;
const PLATFORM_FRAME_SIZE: number = 64;

export class PreloadScene extends Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  protected preload(): void {
    this.load.spritesheet(
      'character',
      './src/games/knightfall/assets/platformerPack_character.png',
      {
        frameWidth: PLAYER_FRAME_SIZE,
        frameHeight: PLAYER_FRAME_SIZE,
      },
    );
    this.load.spritesheet(
      'tiles',
      './src/games/knightfall/assets/platformPack_tilesheet.png',
      {
        frameWidth: PLATFORM_FRAME_SIZE,
        frameHeight: PLATFORM_FRAME_SIZE,
      },
    );
  }

  protected create(): void {
    this.scene.start('GameScene');
  }
}
