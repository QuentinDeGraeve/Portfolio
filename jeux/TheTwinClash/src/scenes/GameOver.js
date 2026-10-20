export default class GameOver extends Phaser.Scene {
  constructor() { super('GameOver'); }

  create(data) {
    // stop any currently playing sounds
    if (this.sound) this.sound.stopAll();

    this.gameOverMusic = this.sound.add('bgmGameOver', { loop: true, volume: 0.5 });
    this.gameOverMusic.play();

    const w = this.scale.width, h = this.scale.height;
    this.add.text(w/2, h/2 - 40, 'GAME OVER', { fontSize: '48px', color: '#ff4444' }).setOrigin(0.5);
    this.add.text(w/2, h/2 + 10, data && data.wave ? `Vous avez tenu jusqu'à la vague ${data.wave}` : 'You were defeated...', { fontSize: '20px' }).setOrigin(0.5);

    // play game over music if available
    if (this.cache.audio.exists('bgmGameOver')) {
      this.sound.play('bgmGameOver', { loop: true, volume: 0.6 });
    }

    // Restart game or go to menu
    const retry = () => {
      this.sound.stopAll();
      // Mode histoire : on rejoue l'étape échouée
      if (data && data.retry) this.scene.start(data.retry.scene, data.retry.data);
      else this.scene.start('Game');
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
