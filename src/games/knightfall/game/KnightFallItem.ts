import { KnightFallItemType } from './KnightFallItemType';

export class KnightFallItem {
  public type: KnightFallItemType;
  public value: any;
}

export function compareTiles(a: KnightFallItem, b: KnightFallItem): boolean {
  return (
    a.type === KnightFallItemType.TILE
    && b.type === KnightFallItemType.TILE
    && a.value === b.value
  );
}
