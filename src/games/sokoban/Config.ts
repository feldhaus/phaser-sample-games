import { AUTO, Scale, Types } from 'phaser';
import { GameScene } from './scenes/GameScene';

export const config: Types.Core.GameConfig = {
  title: 'Sokoban',
  type: AUTO,
  scene: [GameScene],
  backgroundColor: 0x111111,
  scale: {
    width: 800,
    height: 600,
    parent: 'game',
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
};
