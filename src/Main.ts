import { Sokoban } from "./games/sokoban/game";
import { Zhed } from "./games/zhed/game";

window.onload = () => {
  const search: URLSearchParams = new URLSearchParams(window.location.search);
  const game: string = search.get('game');

  switch (game.toLowerCase()) {
    case 'sokoban':
      new Sokoban();
      break;
    case 'zhed':
      new Zhed();
      break;
  }
};
