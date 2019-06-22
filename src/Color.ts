// https://coolors.co/edae49-d1495b-00798c-30638e-003d5b

export const COLOR = {
  MAXIMUM_YELLOW_CARD: 0xedae49,
  DARK_TERRA_COTA: 0xd1495b,
  METALLIC_SEAWEED: 0x00798c,
  BDAZZLED_BLUE: 0x30638e,
  DARK_IMPERIAL_BLUE: 0x003d5b,
};

export function int2hex(color: number): string {
  const hex: string = color.toString(16);
  return '#000000'.slice(0, 7 - hex.length) + hex;
}
