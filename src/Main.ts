import { SokobanGame } from './games/sokoban/Game';
import { ZhedGame } from './games/zhed/Game';

window.onload = () => {
  const search: URLSearchParams = new URLSearchParams(window.location.search);
  const game: string = search.get('game');

  switch (game.toLowerCase()) {
    case 'sokoban':
      // eslint-disable-next-line no-new
      new SokobanGame();
      break;
    case 'zhed':
      // eslint-disable-next-line no-new
      new ZhedGame();
      break;
    default:
      throw Error(`${game} doesn't exist`);
  }
};
