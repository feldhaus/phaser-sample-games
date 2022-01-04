import { KnightFallGame } from './games/knightfall/Game';
import { SokobanGame } from './games/sokoban/Game';
import { SudokuGame } from './games/sudoku/Game';
import { ZhedGame } from './games/zhed/Game';

window.onload = () => {
  const search: URLSearchParams = new URLSearchParams(window.location.search);
  const game: string = search.get('game');

  switch (game.toLowerCase()) {
    case 'knightfall':
      // eslint-disable-next-line no-new
      new KnightFallGame();
      break;
    case 'sokoban':
      // eslint-disable-next-line no-new
      new SokobanGame();
      break;
    case 'sudoku':
      // eslint-disable-next-line no-new
      new SudokuGame();
      break;
    case 'zhed':
      // eslint-disable-next-line no-new
      new ZhedGame();
      break;
    default:
      throw Error(`${game} doesn't exist`);
  }
};
