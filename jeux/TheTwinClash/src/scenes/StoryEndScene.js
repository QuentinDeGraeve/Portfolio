// Écran final du mode histoire : dernier écran puis générique.
export default class StoryEndScene extends Phaser.Scene {
  constructor() { super('StoryEnd'); }

  create() {
    const w = this.scale.width, h = this.scale.height;
    this.sound.stopAll();
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.fadeIn(1500, 0, 0, 0);

    const title = this.add.text(w / 2, h / 2 - 40, 'THE TWIN CLASH', { fontSize: '56px', fontStyle: 'bold' }).setOrigin(0.5).setAlpha(0);
    const sub = this.add.text(w / 2, h / 2 + 30, 'Elles ont combattu pour survivre.\nMaintenant, elles sont libres de vivre.', {
      fontSize: '20px', fontStyle: 'italic', color: '#dddddd', align: 'center', lineSpacing: 8
    }).setOrigin(0.5).setAlpha(0);

    if (this.cache.audio.exists('bgmGameWin')) this.sound.play('bgmGameWin', { loop: true, volume: 0.5 });

    this.tweens.add({ targets: title, alpha: 1, duration: 2000, delay: 800 });
    this.tweens.add({ targets: sub, alpha: 1, duration: 2000, delay: 2800 });

    // Générique
    const credits = [
      'GÉNÉRIQUE', '',
      'Mode Histoire', '',
      'Acte I — Le combat forcé',
      'Acte II — Le spectacle doit continuer',
      'Acte III — Le dernier combat', '',
      'Merci d\'avoir joué'
    ].join('\n');
    const roll = this.add.text(w / 2, h + 20, credits, { fontSize: '20px', align: 'center', color: '#ffffff', lineSpacing: 10 }).setOrigin(0.5, 0).setAlpha(0);
    this.time.delayedCall(7500, () => {
      this.tweens.add({ targets: [title, sub], alpha: 0, duration: 1000 });
      roll.setAlpha(1);
      this.tweens.add({
        targets: roll, y: -roll.height - 20, duration: 14000, ease: 'Linear',
        onComplete: () => this.showMenuPrompt()
      });
    });

    this.input.keyboard.once('keydown-ESC', () => this.toMenu());

    // Bouton tactile pour passer le générique
    const skip = this.add.text(w - 20, 15, 'PASSER >', { fontSize: '16px', color: '#aaaaaa', backgroundColor: '#222222', padding: { x: 10, y: 6 } })
      .setOrigin(1, 0).setDepth(10).setInteractive();
    skip.on('pointerdown', () => this.toMenu());
  }

  showMenuPrompt() {
    this.add.text(this.scale.width / 2, this.scale.height / 2, 'Appuyez sur ESPACE pour revenir au menu', { fontSize: '18px' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-SPACE', () => this.toMenu());
  }

  toMenu() {
    this.sound.stopAll();
    this.scene.start('Menu');
  }
}
