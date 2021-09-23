import { GameScene } from './scenes/GameScene';

export const config: Phaser.Types.Core.GameConfig = {
  title: 'Sokoban',
  type: Phaser.AUTO,
  scene: [GameScene],
  backgroundColor: 0x111111,
  scale: {
    width: 800,
    height: 600,
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};