import { AUTO, Scale, Types } from 'phaser';
import { GameScene } from './scenes/GameScene';
import { PreloadScene } from './scenes/PreloadScene';

export const config: Types.Core.GameConfig = {
  title: 'Sudoku',
  type: AUTO,
  scene: [PreloadScene, GameScene],
  backgroundColor: 0xf1eeeb,
  scale: {
    width: 400,
    height: 600,
    parent: 'game',
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
};
