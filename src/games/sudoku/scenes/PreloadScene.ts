import { Scene } from 'phaser';

export class PreloadScene extends Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  protected create(): void {
    this.scene.start('GameScene');
  }
}
