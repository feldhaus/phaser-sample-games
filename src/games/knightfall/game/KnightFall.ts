import { Vector2 } from '../../../core/Vector2';
import { getRandomElement } from '../../../utils/array/GetRandomElement';
import { removeRandomElement } from '../../../utils/array/RemoveRandomElement';
import { isAdjacent } from '../../../utils/matrix/IsAdjacent';
import { rotateMatrix } from '../../../utils/matrix/RotateMatrix';
import { KnightFallItem } from './KnightFallItem';
import { KnightFallItemType } from './KnightFallItemType';

export class KnightFall {
  private tilesArray: KnightFallItem[][];
  private size: number;

  public buildLevel(size: number, tileValues: any[]): void {
    // tiles are saved in an array called tilesArray
    this.tilesArray = [];

    this.size = size;

    // an array to store all possible spots where to place special items
    const specialItemCandidates: Vector2[] = [];

    // two loops to create a grid made by "fieldSize" x "fieldSize" columns
    for (let i = 0; i < size; i++) {
      this.tilesArray[i] = [];
      for (let j = 0; j < size; j++) {
        // adds a tile at row "i" and column "j"
        this.tilesArray[i][j] = new KnightFallItem();
        this.tilesArray[i][j].type = KnightFallItemType.TILE;

        // adding the spot to special items array
        specialItemCandidates.push(new Vector2(j, i));
      }
    }

    // choosing a random location for the hero
    const heroPos = removeRandomElement(specialItemCandidates);
    this.tilesArray[heroPos.y][heroPos.x].type = KnightFallItemType.PLAYER;

    let randomPos: Vector2;

    // same thing with the key, we just don't want it to be too close to the hero
    do {
      randomPos = removeRandomElement(specialItemCandidates);
    } while (isAdjacent(heroPos, randomPos));
    this.tilesArray[randomPos.y][randomPos.x].type = KnightFallItemType.KEY;

    // same thing with the locked door
    do {
      randomPos = removeRandomElement(specialItemCandidates);
    } while (isAdjacent(heroPos, randomPos));
    this.tilesArray[randomPos.y][randomPos.x].type = KnightFallItemType.DOOR;

    // sets a random value for the remaining tiles
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (this.tilesArray[i][j].type === KnightFallItemType.TILE) {
          this.tilesArray[i][j].value = getRandomElement(tileValues);
        }
      }
    }
  }

  public getLevelRows(): number {
    return this.size;
  }

  public getLevelCols(): number {
    return this.size;
  }

  // eslint-disable-next-line no-unused-vars
  public getItemAt(row: number, col: number): KnightFallItem;

  // eslint-disable-next-line no-unused-vars
  public getItemAt(position: Vector2): KnightFallItem;

  public getItemAt(arg1: any, arg2?: any): KnightFallItem {
    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      return this.tilesArray[arg1][arg2];
    }
    return this.tilesArray[arg1.y][arg1.x];
  }

  public rotate(direction: 'left' | 'right') {
    this.tilesArray = rotateMatrix(this.tilesArray, direction);
  }
}
