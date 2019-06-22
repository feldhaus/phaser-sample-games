import 'phaser';
import { PreloadScene } from './Scenes/PreloadScene';
import { COLOR } from './Color';

const config: GameConfig = {
  title: 'Phaser-Prototypes',
  width: 800,
  height: 600,
  parent: 'game',
  scene: [PreloadScene],
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
