import { FIRST_STEP, runStep } from '../story/storyScript.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    
    // background music
    this.menuMusic = this.sound.add('bgmMenu', { loop: true, volume: 0.5 });
    this.menuMusic.play();

    // background
    this.add.image(480, 270, 'menu').setDisplaySize(this.scale.width, this.scale.height);

    const w = this.scale.width, h = this.scale.height;
    this.add.text(w/2, h/2 - 80, 'THE TWIN CLASH', { fontSize: '48px', fontStyle: 'bold' }).setOrigin(0.5);

    // Mode selection buttons
    const buttonWidth = 200, buttonHeight = 50;
    const storyButtonX = w/2, storyButtonY = h/2 + 30;
    const botButtonX = w/2 - 110, botButtonY = h/2 + 95;
    const survButtonX = w/2 + 110, survButtonY = h/2 + 95;
    const ctrlButtonX = w/2, ctrlButtonY = h/2 + 160;

    const stopMusic = () => {
      if (this.menuMusic && this.menuMusic.isPlaying) {
        this.menuMusic.stop();
      }
    };

    // MODE HISTOIRE button
    const storyButton = this.add.rectangle(storyButtonX, storyButtonY, buttonWidth * 1.4, buttonHeight, 0xc0392b)
      .setInteractive()
      .setStrokeStyle(2, 0xffffff);
    this.add.text(storyButtonX, storyButtonY, 'MODE HISTOIRE', { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);

    storyButton.on('pointerover', () => storyButton.setFillStyle(0xa93226));
    storyButton.on('pointerout', () => storyButton.setFillStyle(0xc0392b));
    storyButton.on('pointerdown', () => {
      stopMusic();
      runStep(this, FIRST_STEP);
    });

    // VS BOT button
    const botButton = this.add.rectangle(botButtonX, botButtonY, buttonWidth, buttonHeight, 0x4CAF50)
      .setInteractive()
      .setStrokeStyle(2, 0xffffff);
    this.add.text(botButtonX, botButtonY, 'COMBAT', { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);

    botButton.on('pointerover', () => botButton.setFillStyle(0x45a049));
    botButton.on('pointerout', () => botButton.setFillStyle(0x4CAF50));
    botButton.on('pointerdown', () => {
      stopMusic();
      this.scene.start('Game');
    });

    // SURVIE button (gameplay de l'acte II, vagues infinies)
    const survButton = this.add.rectangle(survButtonX, survButtonY, buttonWidth, buttonHeight, 0x2196F3)
      .setInteractive()
      .setStrokeStyle(2, 0xffffff);
    this.add.text(survButtonX, survButtonY, 'SURVIE', { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);

    survButton.on('pointerover', () => survButton.setFillStyle(0x0b7dda));
    survButton.on('pointerout', () => survButton.setFillStyle(0x2196F3));
    survButton.on('pointerdown', () => {
      stopMusic();
      this.scene.start('Shooter');
    });

    // CONTRÔLES button
    const ctrlButton = this.add.rectangle(ctrlButtonX, ctrlButtonY, buttonWidth * 1.4, buttonHeight, 0x555555)
      .setInteractive()
      .setStrokeStyle(2, 0xaaaaaa);
    this.add.text(ctrlButtonX, ctrlButtonY, '🎮 CONTRÔLES', { fontSize: '18px', fontStyle: 'bold', color: '#dddddd' }).setOrigin(0.5);

    ctrlButton.on('pointerover', () => ctrlButton.setFillStyle(0x777777));
    ctrlButton.on('pointerout', () => ctrlButton.setFillStyle(0x555555));
    ctrlButton.on('pointerdown', () => this.showControls());

    // Overlay contrôles (cachée par défaut)
    this._buildControlsOverlay(w, h);
  }

  _buildControlsOverlay(w, h) {
    const depth = 200;
    const panelW = 620, panelH = 370;
    const cx = w / 2, cy = h / 2;

    // Fond semi-transparent
    this._ctrlBg = this.add.rectangle(cx, cy, w, h, 0x000000, 0.75).setDepth(depth).setVisible(false);
    this._ctrlPanel = this.add.rectangle(cx, cy, panelW, panelH, 0x1a1a2e, 1)
      .setStrokeStyle(2, 0xffffff).setDepth(depth + 1).setVisible(false);

    this._ctrlTitle = this.add.text(cx, cy - panelH / 2 + 28, 'CONTRÔLES', {
      fontSize: '22px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5).setDepth(depth + 2).setVisible(false);

    const col = (side) => cx + (side === 'left' ? -panelW / 2 + 30 : 20);
    const rowY = (i) => cy - panelH / 2 + 75 + i * 34;

    const sections = [
      // Colonne gauche — Combat (VS Bot / Mode Histoire)
      { x: col('left'), y: rowY(0), text: '── Combat (VS Bot / Histoire) ──', color: '#f0c040', anchor: 0 },
      { x: col('left'), y: rowY(1), text: '← → ou Q D', label: 'Se déplacer', color: '#6ec1ff', anchor: 0 },
      { x: col('left'), y: rowY(2), text: '↑ ou Z / ↓ ou S', label: 'Sauter / Accroupir', color: '#6ec1ff', anchor: 0 },
      { x: col('left'), y: rowY(3), text: 'ESPACE', label: 'Attaquer', color: '#6ec1ff', anchor: 0 },
      { x: col('left'), y: rowY(4), text: 'SHIFT', label: 'Attaque spéciale', color: '#6ec1ff', anchor: 0 },
      { x: col('left'), y: rowY(5), text: 'D', label: 'Dash', color: '#6ec1ff', anchor: 0 },
      // Colonne droite — Mode Survie
      { x: col('right'), y: rowY(0), text: '── Mode Survie ──', color: '#f0c040', anchor: 0 },
      { x: col('right'), y: rowY(1), text: '← → ↑ ↓ / ZQSD', label: 'Déplacer Adèle', color: '#ff8fd0', anchor: 0 },
      { x: col('right'), y: rowY(2), text: 'Souris', label: 'Viser', color: '#ff8fd0', anchor: 0 },
      { x: col('right'), y: rowY(3), text: 'Clic / ESPACE', label: 'Tirer', color: '#ff8fd0', anchor: 0 },
      { x: col('right'), y: rowY(4), text: 'Joystick G (mobile)', label: 'Déplacer', color: '#ff8fd0', anchor: 0 },
      { x: col('right'), y: rowY(5), text: 'Joystick D (mobile)', label: 'Viser & tirer', color: '#ff8fd0', anchor: 0 },
    ];

    this._ctrlItems = sections.map(s => {
      const key = this.add.text(s.x, s.y, s.text, {
        fontSize: '13px', fontStyle: 'bold', color: s.color
      }).setDepth(depth + 2).setVisible(false);
      const lbl = s.label ? this.add.text(s.x + key.width + 10, s.y, `  ${s.label}`, {
        fontSize: '13px', color: '#cccccc'
      }).setDepth(depth + 2).setVisible(false) : null;
      return [key, lbl];
    }).flat().filter(Boolean);

    // Bouton fermer
    const closeW = 120, closeH = 38;
    this._ctrlClose = this.add.rectangle(cx, cy + panelH / 2 - 26, closeW, closeH, 0x444444)
      .setStrokeStyle(1, 0xffffff).setInteractive().setDepth(depth + 2).setVisible(false);
    this._ctrlCloseTxt = this.add.text(cx, cy + panelH / 2 - 26, 'FERMER', {
      fontSize: '15px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5).setDepth(depth + 3).setVisible(false);

    this._ctrlClose.on('pointerover', () => this._ctrlClose.setFillStyle(0x666666));
    this._ctrlClose.on('pointerout', () => this._ctrlClose.setFillStyle(0x444444));
    this._ctrlClose.on('pointerdown', () => this.hideControls());
    this._ctrlBg.setInteractive().on('pointerdown', () => this.hideControls());
  }

  showControls() {
    const items = [this._ctrlBg, this._ctrlPanel, this._ctrlTitle, this._ctrlClose, this._ctrlCloseTxt, ...this._ctrlItems];
    items.forEach(o => o.setVisible(true));
  }

  hideControls() {
    const items = [this._ctrlBg, this._ctrlPanel, this._ctrlTitle, this._ctrlClose, this._ctrlCloseTxt, ...this._ctrlItems];
    items.forEach(o => o.setVisible(false));
  }
}
