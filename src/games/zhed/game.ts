import 'phaser';
import { GameScene } from './scenes/game-scene';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Zhed',
  type: Phaser.AUTO,
  scene: [GameScene],
  backgroundColor: 0x333333,
  scale: {
    width: 800,
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
