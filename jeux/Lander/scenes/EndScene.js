import { levels, getLevelEntry } from '../levels/index.js';

export default class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  // Méthode utilitaire pour créer des boutons tactiles
  createButton(x, y, text, color, callback) {
    const btn = this.add.rectangle(x, y, 200, 50, color).setInteractive();
    const label = this.add.text(x, y, text, { 
      fontSize: '18px', color: '#ffffff', fontStyle: 'bold' 
    }).setOrigin(0.5);

    btn.on('pointerdown', callback);
    btn.on('pointerover', () => btn.setAlpha(0.8));
    btn.on('pointerout', () => btn.setAlpha(1));
    return btn;
  }

  create(data) {
    if (this.sound) this.sound.stopAll();

    const w = this.scale.width;
    const h = this.scale.height;
    const levelKey = data?.levelKey || 'Level1';
    const success = data?.success === true;
    const message = data?.message || (success ? 'Mission complete' : 'Mission failed');

    const currentLevelIndex = levels.findIndex(entry => entry.sceneKey === levelKey);
    const hasNextLevel = currentLevelIndex >= 0 && currentLevelIndex < levels.length - 1;
    const nextLevelKey = hasNextLevel ? levels[currentLevelIndex + 1].sceneKey : null;

    this.add.rectangle(w / 2, h / 2, w, h, success ? 0x001a4d : 0x4d0000);

    // --- LOGIQUE DE NAVIGATION ---
    const goToNext = () => {
      this.sound.stopAll();
      if (hasNextLevel) this.scene.start(nextLevelKey);
      else this.scene.start('Menu');
    };

    const goToMenu = () => {
      this.sound.stopAll();
      this.scene.start('Menu');
    };

    const retry = () => {
      this.sound.stopAll();
      this.scene.start(levelKey);
    };

    // --- AFFICHAGE ---
    if (success) {
      this.add.text(w / 2, h / 2 - 80, hasNextLevel ? 'LEVEL COMPLETE!' : 'GAME COMPLETE!', {
        fontSize: '48px', color: '#44ff88', fontStyle: 'bold'
      }).setOrigin(0.5);

      this.createButton(w / 2, h / 2 + 40, 'CONTINUE', 0x448844, goToNext);
      
      // Support clavier
      this.input.keyboard.on('keydown-SPACE', goToNext);
    } else {
      this.add.text(w / 2, h / 2 - 80, 'MISSION FAILED', {
        fontSize: '48px', color: '#ff4444', fontStyle: 'bold'
      }).setOrigin(0.5);

      this.createButton(w / 2, h / 2, 'RETRY', 0x884444, retry);
      this.createButton(w / 2, h / 2 + 70, 'MENU', 0x444488, goToMenu);
      
      // Support clavier
      this.input.keyboard.on('keydown-R', retry);
      this.input.keyboard.on('keydown-SPACE', goToMenu);
    }

    if (this.cache.audio.exists(success ? 'bgmWin' : 'bgmGameOver')) {
      this.sound.play(success ? 'bgmWin' : 'bgmGameOver', { loop: true, volume: 0.6 });
    }
  }
}