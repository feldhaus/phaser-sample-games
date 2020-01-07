import 'phaser';
import { PreloadScene } from './Scenes/PreloadScene';
import { Zhed } from './Scenes/Zhed';
import { COLOR } from './Color';

const config: GameConfig = {
  title: 'Phaser-Prototypes',
  width: 800,
  height: 600,
  parent: 'game',
  scene: [PreloadScene, Zhed],
  backgroundColor: COLOR.DARK_IMPERIAL_BLUE,
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  const game = new Game(config);
};
