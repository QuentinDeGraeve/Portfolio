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
    this.add.text(w/2, h/2 - 20, 'Arrow keys: move   SPACE: attack   Shift: special   D: dash', { fontSize: '14px' }).setOrigin(0.5);
    
    // Mode selection buttons
    const buttonWidth = 200, buttonHeight = 50;
    const botButtonX = w/2 - 130, botButtonY = h/2 + 50;
    const pvpButtonX = w/2 + 130, pvpButtonY = h/2 + 50;
    
    // VS BOT button
    const botButton = this.add.rectangle(botButtonX, botButtonY, buttonWidth, buttonHeight, 0x4CAF50)
      .setInteractive()
      .setStrokeStyle(2, 0xffffff);
    this.add.text(botButtonX, botButtonY, 'VS BOT', { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    
    botButton.on('pointerover', () => botButton.setFillStyle(0x45a049));
    botButton.on('pointerout', () => botButton.setFillStyle(0x4CAF50));
    botButton.on('pointerdown', () => {
      if (this.menuMusic && this.menuMusic.isPlaying) {
        this.menuMusic.stop();
      }
      this.scene.start('Game', { pvp: false });
    });
    
    // PVP button
    const pvpButton = this.add.rectangle(pvpButtonX, pvpButtonY, buttonWidth, buttonHeight, 0x2196F3)
      .setInteractive()
      .setStrokeStyle(2, 0xffffff);
    this.add.text(pvpButtonX, pvpButtonY, 'VS JOUEUR', { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    
    pvpButton.on('pointerover', () => pvpButton.setFillStyle(0x0b7dda));
    pvpButton.on('pointerout', () => pvpButton.setFillStyle(0x2196F3));
    pvpButton.on('pointerdown', () => {
      if (this.menuMusic && this.menuMusic.isPlaying) {
        this.menuMusic.stop();
      }
      this.scene.start('Game', { pvp: true });
    });
    
    this.add.text(w/2, h/2 + 130, 'Cliquez sur un mode pour commencer', { fontSize: '14px' }).setOrigin(0.5);
  }
}
