import { Types } from 'phaser';

export const BACKGROUND_COLOR = 0xfff8f7;

export const GRID_INNER_LINE_WIDTH = 1;
export const GRID_INNER_LINE_COLOR = 0x000000;
export const GRID_OUTER_LINE_WIDTH = 3;
export const GRID_OUTER_LINE_COLOR = 0x000000;

export const SELECTED_LINE_COLOR = 0xe5dee0;
export const SELECTED_TILE_COLOR = 0xc3bbc7;

export const BOARD_TEXT_STYLE: Types.GameObjects.Text.TextStyle = {
  fontSize: '36px',
  fontFamily: '"Lucida Console", Monaco, monospace',
  color: '#000000',
  align: 'center',
};

export const BOARD_TEXT_STYLE_FILLED: Types.GameObjects.Text.TextStyle = {
  color: '#ff0000',
};

export const BOARD_TEXT_STYLE_USED: Types.GameObjects.Text.TextStyle = {
  color: '#0000ff',
};

export const BTN_SIZE = 80;
export const BTN_PADDING = 5;
export const BTN_COLOR = 0x333333;

export const BTN_TEXT_STYLE: Types.GameObjects.Text.TextStyle = {
  fontSize: '42px',
  fontFamily: '"Lucida Console", Monaco, monospace',
  color: '#ffffff',
  align: 'center',
};
