import { getRandomElement } from '../../../utils/array/GetRandomElement';
import { removeRandomElement } from '../../../utils/array/RemoveRandomElement';
import { floodFill } from '../../../utils/matrix/FloodFill';
import { isAdjacent } from '../../../utils/matrix/IsAdjacent';
import { isInside } from '../../../utils/matrix/IsInside';
import { rotateMatrix } from '../../../utils/matrix/RotateMatrix';
import { compareTiles, KnightFallItem } from './KnightFallItem';
import { KnightFallItemType } from './KnightFallItemType';

export class KnightFall {
  private level: KnightFallItem[][];
  private size: number;

  public buildLevel(size: number, tileValues: any[]): void {
    this.level = [];
    this.size = size;

    // an array to store all possible spots where to place special items
    const specialItemCandidates: { row: number; col: number }[] = [];

    for (let row = 0; row < size; row++) {
      this.level[row] = [];
      for (let col = 0; col < size; col++) {
        this.level[row][col] = new KnightFallItem();
        this.level[row][col].type = KnightFallItemType.TILE;
        specialItemCandidates.push({ row, col });
      }
    }

    // choosing a random location for the hero
    const heroPos = removeRandomElement(specialItemCandidates);
    this.level[heroPos.row][heroPos.col].type = KnightFallItemType.PLAYER;

    let randomPos: { row: number; col: number };

    // same thing with the key, we just don't want it to be too close to the hero
    do {
      randomPos = removeRandomElement(specialItemCandidates);
    } while (isAdjacent(heroPos, randomPos, true));
    this.level[randomPos.row][randomPos.col].type = KnightFallItemType.KEY;

    // same thing with the locked door
    do {
      randomPos = removeRandomElement(specialItemCandidates);
    } while (isAdjacent(heroPos, randomPos, true));
    this.level[randomPos.row][randomPos.col].type = KnightFallItemType.DOOR;

    // sets a random value for the remaining tiles
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (this.level[row][col].type === KnightFallItemType.TILE) {
          this.level[row][col].value = getRandomElement(tileValues);
        }
      }
    }
  }

  public getLevelSize(): number {
    return this.size;
  }

  public getItemAt(row: number, col: number): KnightFallItem {
    if (!isInside(this.level, row, col)) return undefined;
    return this.level[row][col];
  }

  public rotate(direction: 'left' | 'right'): void {
    this.level = rotateMatrix(this.level, direction);
  }

  public selectItemAt(
    row: number,
    col: number,
  ): { row: number; col: number }[] {
    const array = floodFill(this.level, row, col, compareTiles);
    if (array.length < 2) return [];
    array.forEach((item) => {
      this.level[item.row][item.col].type = KnightFallItemType.EMPTY;
    });
    return array;
  }
}
