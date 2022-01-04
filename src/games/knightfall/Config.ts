import { AUTO, Scale, Types } from 'phaser';
import { GameScene } from './scenes/GameScene';
import { PreloadScene } from './scenes/PrealoadScene';

export const config: Types.Core.GameConfig = {
  title: 'KnightFall',
  type: AUTO,
  scene: [PreloadScene, GameScene],
  backgroundColor: 0x333333,
  scale: {
    width: 800,
    height: 1300,
    parent: 'game',
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
};
