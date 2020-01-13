import 'phaser';
import { PreloadScene } from './Scenes/PreloadScene';
import { Zhed } from './Scenes/Zhed';
import { Sokoban } from './Scenes/Sokoban';
import { COLOR } from './Color';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Phaser-Prototypes',
  type: Phaser.AUTO,
  scene: [PreloadScene, Zhed, Sokoban],
  backgroundColor: COLOR.DARK_IMPERIAL_BLUE,
  scale: {
    width: 800,
    height: 600,
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  new Game(config);
};
