import { Game } from 'phaser';
import { config } from './Config';

export class SudokuGame extends Game {
  constructor() {
    super(config);
  }
}
