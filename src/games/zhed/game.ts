import 'phaser';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Zhed',
  type: Phaser.AUTO,
  scene: [GameScene],
  backgroundColor: 0xdbf1c6,
  scale: {
    width: 400,
    height: 600,
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export class ZhedGame extends Phaser.Game {
  constructor() {
    super(config);
  }
}
