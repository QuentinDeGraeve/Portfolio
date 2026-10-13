import { WIN_SCORE } from '../data/questions.js';

export default class ResultScene extends Phaser.Scene {
  constructor() { super('Result'); }

  create(data) {
    const w = this.scale.width, h = this.scale.height;
    const score = data.score ?? 0, total = data.total ?? 10;
    const win = score >= WIN_SCORE;

    this.sound.stopAll();
    if (this.cache.audio.exists('bgmResult')) {
      this.sound.play('bgmResult', { loop: true, volume: 0.6 });
    }

    const stroke = { stroke: '#000000', strokeThickness: 6 };
    this.add.text(w/2, h/2 - 80, win ? 'GAGNÉ !' : 'PERDU...', { fontSize: '48px', fontStyle: 'bold', color: win ? '#44ff88' : '#ff4444', ...stroke }).setOrigin(0.5);
    this.add.text(w/2, h/2 - 20, `Score : ${score}/${total}`, { fontSize: '28px', fontStyle: 'bold', color: '#ffffff', ...stroke }).setOrigin(0.5);
    this.add.text(w/2, h/2 + 20, win ? 'Tu reconnais bien les jumelles !' : `Il fallait ${WIN_SCORE}/${total} pour gagner.`, { fontSize: '16px', color: '#ffffff', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5);

    this.makeButton(w/2 - 130, h/2 + 90, 'REJOUER', 0x4CAF50, 0x45a049, () => this.scene.start('Quiz'));
    this.makeButton(w/2 + 130, h/2 + 90, 'MENU', 0x2196F3, 0x0b7dda, () => this.scene.start('Menu'));

    this.input.keyboard.on('keydown-R', () => this.scene.start('Quiz'));
    this.input.keyboard.on('keydown-SPACE', () => this.scene.start('Menu'));
  }

  makeButton(x, y, label, color, hover, onClick) {
    const rect = this.add.rectangle(x, y, 200, 50, color)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff);
    this.add.text(x, y, label, { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    rect.on('pointerover', () => rect.setFillStyle(hover));
    rect.on('pointerout', () => rect.setFillStyle(color));
    rect.on('pointerdown', onClick);
  }
}
