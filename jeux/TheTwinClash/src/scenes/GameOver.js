export default class GameOver extends Phaser.Scene {
  constructor() { super('GameOver'); }

  create(data) {
    // stop any currently playing sounds
    if (this.sound) this.sound.stopAll();

    this.gameOverMusic = this.sound.add('bgmGameOver', { loop: true, volume: 0.5 });
    this.gameOverMusic.play();

    const w = this.scale.width, h = this.scale.height;
    this.add.text(w/2, h/2 - 40, 'GAME OVER', { fontSize: '48px', color: '#ff4444' }).setOrigin(0.5);
    this.add.text(w/2, h/2 + 10, 'You were defeated...', { fontSize: '20px' }).setOrigin(0.5);
    this.add.text(w/2, h/2 + 50, 'Press R to retry or SPACE for menu', { fontSize: '16px' }).setOrigin(0.5);

    // play game over music if available
    if (this.cache.audio.exists('bgmGameOver')) {
      this.sound.play('bgmGameOver', { loop: true, volume: 0.6 });
    }

    // Restart game or go to menu
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
