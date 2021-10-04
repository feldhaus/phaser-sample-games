import { Game } from 'phaser';
import { config } from './Config';

export class SokobanGame extends Game {
  constructor() {
    super(config);
  }
}
