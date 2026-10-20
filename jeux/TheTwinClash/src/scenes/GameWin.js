export default class GameWin extends Phaser.Scene {
  constructor() { super('GameWin'); }

  create(data) {
    if (this.sound) this.sound.stopAll();

    const w = this.scale.width, h = this.scale.height;
    this.add.text(w/2, h/2 - 40, 'YOU WIN!', { fontSize: '48px', color: '#44ff88' }).setOrigin(0.5);
    this.add.text(w/2, h/2 + 10, 'The bot has been defeated!', { fontSize: '20px' }).setOrigin(0.5);

    // play game win music if available
    if (this.cache.audio.exists('bgmGameWin')) {
      this.sound.play('bgmGameWin', { loop: true, volume: 0.6 });
    }
    const retry = () => {
      this.sound.stopAll();
      this.scene.start('Game');
    };
    const toMenu = () => {
      this.sound.stopAll();
      this.scene.start('Menu');
    };
    this.input.keyboard.on('keydown-R', retry);
    this.input.keyboard.on('keydown-SPACE', toMenu);

    // Boutons tactiles / souris
    this.makeButton(w/2 - 110, h/2 + 110, 'REJOUER', 0x4CAF50, retry);
    this.makeButton(w/2 + 110, h/2 + 110, 'MENU', 0x2196F3, toMenu);
  }

  makeButton(x, y, label, color, onClick) {
    const btn = this.add.rectangle(x, y, 180, 50, color).setStrokeStyle(2, 0xffffff).setInteractive();
    this.add.text(x, y, label, { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    btn.on('pointerdown', onClick);
  }
}
