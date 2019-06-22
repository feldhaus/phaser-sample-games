import 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  create(): void {
    const search: URLSearchParams = new URLSearchParams(window.location.search);
    const game: string = search.get('game');

    if (this.scene.manager.keys.hasOwnProperty(game)) {
      this.scene.start(game);
    } else {
      this.add.text(
        this.sys.canvas.width / 2,
        this.sys.canvas.height / 2,
        `${game} not found!`,
        {
          fontSize: '16px',
          color: '#ffffff',
          align: 'center',
        },
      );
    }
  }
}
