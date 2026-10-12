export default class GameWin extends Phaser.Scene {
  constructor() { super('GameWin'); }

  create(data) {
    if (this.sound) this.sound.stopAll();

    const w = this.scale.width, h = this.scale.height;
    this.add.text(w/2, h/2 - 40, 'YOU WIN!', { fontSize: '48px', color: '#44ff88' }).setOrigin(0.5);
    this.add.text(w/2, h/2 + 10, 'The bot has been defeated!', { fontSize: '20px' }).setOrigin(0.5);
    this.add.text(w/2, h/2 + 50, 'Press R to retry or SPACE for menu', { fontSize: '16px' }).setOrigin(0.5);

    // play game win music if available
    if (this.cache.audio.exists('bgmGameWin')) {
      this.sound.play('bgmGameWin', { loop: true, volume: 0.6 });
    }
    this.input.keyboard.on('keydown-R', () => {
      this.sound.stopAll();
      this.scene.start('Game');
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      this.sound.stopAll();
      this.scene.start('Menu');
    });
  }
}
