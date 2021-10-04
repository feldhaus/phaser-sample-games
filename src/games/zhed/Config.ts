import { AUTO, Scale, Types } from 'phaser';
import { GameScene } from './scenes/GameScene';

export const config: Types.Core.GameConfig = {
  title: 'Zhed',
  type: AUTO,
  scene: [GameScene],
  backgroundColor: 0xdbf1c6,
  scale: {
    width: 400,
    height: 600,
    parent: 'game',
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
};
