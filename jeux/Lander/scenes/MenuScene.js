import { levels } from '../levels/index.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    // Background music (if available)
    if (this.cache.audio.exists('bgmMenu')) {
      this.menuMusic = this.sound.add('bgmMenu', { loop: true, volume: 0.5 });
      this.menuMusic.play();
    }

    const w = this.scale.width, h = this.scale.height;
    
    // Background
    this.add.rectangle(w / 2, h / 2, w, h, 0x001a4d);

    // Title
    this.add.text(w / 2, h / 2 - 140, 'SPACE LANDER', { 
      fontSize: '56px', 
      fontStyle: 'bold',
      color: '#00ffff'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(w / 2, h / 2 - 80, 'A Journey Across the Stars', { 
      fontSize: '18px',
      color: '#aaaaaa',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Instructions
    this.add.text(w / 2, h / 2 - 20, 'Arrow Keys: Rotate | Up: Thrust', { 
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(w / 2, h / 2 + 10, 'Manage your fuel carefully!', { 
      fontSize: '14px',
      color: '#ffaa44'
    }).setOrigin(0.5);

    // --- LEVEL SELECTION ---
    this.add.text(w / 2, h / 2 + 60, 'SELECT LEVEL:', { 
      fontSize: '16px',
      color: '#44ff88',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const buttonWidth = 150;
    const buttonHeight = 45;
    const startY = h / 2 + 120;
    const spacingX = 220;

    levels.forEach((level, index) => {
      const x = w / 2 + (index - (levels.length - 1) / 2) * spacingX;
      const y = startY;

      const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, level.buttonColor || 0x4CAF50)
        .setInteractive()
        .setStrokeStyle(2, 0xffffff);
      this.add.text(x, y, level.label, { 
        fontSize: '18px', 
        fontStyle: 'bold', 
        color: '#ffffff' 
      }).setOrigin(0.5);

      button.on('pointerover', () => button.setFillStyle(level.buttonHoverColor || 0x45a049));
      button.on('pointerout', () => button.setFillStyle(level.buttonColor || 0x4CAF50));
      button.on('pointerdown', () => {
        if (this.menuMusic && this.menuMusic.isPlaying) {
          this.menuMusic.stop();
        }
        this.scene.start(level.sceneKey);
      });
    });

    // Keyboard shortcuts
    levels.forEach((level, index) => {
      this.input.keyboard.on(`keydown-${index + 1}`, () => {
        this.startLevel(index + 1);
      });
    });

    // Instructions
    this.add.text(w / 2, h / 2 + 200, 'Press 1 or 2 to select level', { 
      fontSize: '12px',
      color: '#aaaaaa'
    }).setOrigin(0.5);
  }

  startLevel(number) {
    const level = levels[number - 1];
    if (!level) return;
    if (this.menuMusic && this.menuMusic.isPlaying) {
      this.menuMusic.stop();
    }
    this.scene.start(level.sceneKey);
  }
}
