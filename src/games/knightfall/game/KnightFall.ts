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
  private tileValues: any[];

  public buildLevel(size: number, tileValues: any[]): void {
    this.level = [];
    this.size = size;
    this.tileValues = tileValues;

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
          this.level[row][col].value = getRandomElement(this.tileValues);
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
    this.endMove();
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

  public fillVerticalHoles(): void {
    for (let row = this.size - 2; row >= 0; row--) {
      for (let col = 0; col < this.size; col++) {
        if (this.level[row][col].type !== KnightFallItemType.EMPTY) {
          const holesBelow = this.countSpacesBelow(row, col);
          if (holesBelow === 0) continue;
          this.moveDown(row, col, holesBelow);
        }
      }
    }

    for (let col = 0; col < this.size; col++) {
      const topHoles = this.countSpacesBelow(-1, col);
      for (let row = topHoles - 1; row >= 0; row--) {
        this.level[row][col].type = KnightFallItemType.TILE;
        this.level[row][col].value = getRandomElement(this.tileValues);
      }
    }

    this.endMove();
  }

  public endMove(): void {
    const { row, col } = this.findItem(KnightFallItemType.PLAYER);
    if (row === undefined || col === undefined) return;
    if (row === this.size - 1) return;

    // eslint-disable-next-line default-case
    switch (this.level[row + 1][col].type) {
      case KnightFallItemType.KEY:
        this.openDoor();
        this.moveDown(row, col, 1);
        this.fillVerticalHoles();
        break;
      case KnightFallItemType.UNLOCKEDDOOR:
        console.log('there is a unlocked door below');
        break;
    }
  }

  private countSpacesBelow(row: number, col: number): number {
    let result = 0;
    for (let i = row + 1; i < this.size; i++) {
      if (this.level[i][col].type === KnightFallItemType.EMPTY) {
        result += 1;
      }
    }
    return result;
  }

  private moveDown(row: number, col: number, holesBelow: number): void {
    const item = this.level[row][col];
    this.level[row + holesBelow][col].type = item.type;
    this.level[row + holesBelow][col].value = item.value;
    this.level[row][col].type = KnightFallItemType.EMPTY;
  }

  private findItem(itemType: KnightFallItemType): { row: number; col: number } {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.level[row][col].type === itemType) {
          return { row, col };
        }
      }
    }
    return { row: undefined, col: undefined };
  }

  private openDoor(): void {
    const { row, col } = this.findItem(KnightFallItemType.DOOR);
    if (row === undefined || col === undefined) return;
    this.level[row][col].type = KnightFallItemType.UNLOCKEDDOOR;
  }
}
