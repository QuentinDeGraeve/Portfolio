import HealthBar from '../ui/HealthBar.js';
export default class HudScene extends Phaser.Scene {
  constructor() { super('HUD'); }
  init(data) {
    this.player = data.player; this.bot = data.bot; this.gameScene = data.gameScene;
    this.ally = data.ally || null; this.noTimer = !!data.noTimer; this.names = data.names || null;
  }
  create() {
    this.playerBar = new HealthBar(this, 20, 20, this.player, 0x46d160);
    this.botBar = new HealthBar(this, 720, 20, this.bot, 0xff4444);

    // Mode histoire : noms des combattants et barre de vie de la sœur alliée
    if (this.names) {
      this.add.text(20, 2, this.names.player, { fontSize: '12px', fontStyle: 'bold', color: '#6ec1ff' });
      this.add.text(720, 2, this.names.bot, { fontSize: '12px', fontStyle: 'bold', color: '#ff8f8f' });
    }
    if (this.ally) {
      this.allyBar = new HealthBar(this, 20, 90, this.ally, 0xff8fd0);
      this.add.text(20, 72, this.names ? this.names.ally : '', { fontSize: '12px', fontStyle: 'bold', color: '#ff8fd0' });
    }

    // Timer setup
    if (this.noTimer) return;
    this.timerText = this.add.text(480, 55, String(this.gameScene.gameTime), {
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
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
    if (this.allyBar) this.allyBar.update();
  }

  updateTimer() {
    if (this.gameScene.gameOver || !this.gameScene.started) return;
    
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
