import HealthBar from '../ui/HealthBar.js';
export default class HudScene extends Phaser.Scene {
  constructor() { super('HUD'); }
  init(data) {
    this.player = data.player; this.bot = data.bot; this.gameScene = data.gameScene;
  }
  create() {
    this.playerBar = new HealthBar(this, 20, 20, this.player, 0x46d160);
    this.botBar = new HealthBar(this, 720, 20, this.bot, 0xff4444);
    this.info = this.add.text(20, 48, 'SPACE: attack | SHIFT: special | D: dash', { fontSize: '14px' });

    // Timer setup
    this.timerText = this.add.text(480, 50, '90', { 
      fontSize: '32px', 
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Start countdown timer
    this.time.addEvent({
      delay: 1000, // 1 second
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }
  update() {
    this.playerBar.update();
    this.botBar.update();
  }

  updateTimer() {
    if (this.gameScene.gameOver) return;
    
    this.gameScene.gameTime--;
    
    // Display only seconds
    this.timerText.setText(this.gameScene.gameTime.toString());
    
    // Change color when time is low
    if (this.gameScene.gameTime <= 10) {
      this.timerText.setColor('#ff4444'); // Red when 10 seconds left
    } else if (this.gameScene.gameTime <= 30) {
      this.timerText.setColor('#ffaa44'); // Orange when 30 seconds left
    }

    // Check if time's up
    if (this.gameScene.gameTime <= 0) {
      this.gameScene.endGame();
    }
  }
}
