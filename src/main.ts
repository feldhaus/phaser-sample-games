import { SokobanGame } from './games/sokoban/game';
import { ZhedGame } from './games/zhed/game';

window.onload = () => {
  const search: URLSearchParams = new URLSearchParams(window.location.search);
  const game: string = search.get('game');
  switch (game.toLowerCase()) {
    case 'sokoban':
      new SokobanGame();
      break;
    case 'zhed':
      new ZhedGame();
      break;
  }
};
