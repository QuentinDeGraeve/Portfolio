import Player from '../entities/Player.js';
import Player2 from '../entities/Player2.js';
import Bot from '../entities/Bot.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  create(data) {
    // background
    this.add.image(480, 270, 'bg').setDisplaySize(this.scale.width, this.scale.height);

    // background music
    this.gameSceneMusic = this.sound.add('bgmCombat', { loop: true, volume: 0.5 });
    this.gameSceneMusic.play();

    // particle manager for hits/trails
    this.particles = this.add.particles('hit');

    // Determine game mode
    this.pvp = data && data.pvp === true;

    if (this.pvp) {
      // Player vs Player mode
      this.player = new Player(this, 180, 420, this.particles);
      this.bot = new Player2(this, 760, 420, this.particles);
      this.displayMode = 'PVP';
    } else {
      // Player vs Bot mode
      this.player = new Player(this, 180, 420, this.particles);
      this.bot = new Bot(this, 760, 420, this.particles);
      this.displayMode = 'BOT';
    }

    this.player.setCollideWorldBounds(true);
    this.bot.setCollideWorldBounds(true);

    // small world bounds floor
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    // launch HUD and pass references
    this.scene.launch('HUD', { player: this.player, bot: this.bot, gameScene: this });

    this.cameras.main.setBackgroundColor('#10131a');

    this.gameOver = false;
    this.gameTime = 90; // Initialize game time
  }

  update() {
    if (this.gameOver) return;
    this.player.update(this.bot);
    this.bot.update(this.player);

    // play proper animations according to state
    this.syncAnimations();

    if (!this.player.isAlive || !this.bot.isAlive) this.endGame();
  }

  syncAnimations() {
    // player
    if (!this.player.isAlive) return;
    const pCurrentAnim = this.player.anims.currentAnim?.key;
    
    if (this.player.state === 'idle' && pCurrentAnim !== 'adele_idle') this.player.play('adele_idle', true);
    else if (this.player.state === 'run' && pCurrentAnim !== 'adele_walk') this.player.play('adele_walk', true);
    else if (this.player.state === 'attack' && pCurrentAnim !== 'adele_punch') this.player.play('adele_punch', true);
    else if (this.player.state === 'kick' && pCurrentAnim !== 'adele_kick') this.player.play('adele_kick', true);
    else if (this.player.state === 'jump' && pCurrentAnim !== 'adele_jump') this.player.play('adele_jump', true);
    else if (this.player.state === 'dash' && pCurrentAnim !== 'adele_dash') this.player.play('adele_dash', true);
    else if (this.player.state === 'special' && pCurrentAnim !== 'adele_special_move') this.player.play('adele_special_move', true);
    
    // bot
    if (!this.bot.isAlive) return;
    const bCurrentAnim = this.bot.anims.currentAnim?.key;
    
    if (this.bot.state === 'idle' && bCurrentAnim !== 'heloise_idle') this.bot.play('heloise_idle', true);
    else if (this.bot.state === 'run' && bCurrentAnim !== 'heloise_walk') this.bot.play('heloise_walk', true);
    else if (this.bot.state === 'attack' && bCurrentAnim !== 'heloise_punch') this.bot.play('heloise_punch', true);
    else if (this.bot.state === 'kick' && bCurrentAnim !== 'heloise_kick') this.bot.play('heloise_kick', true);
    else if (this.bot.state === 'jump' && bCurrentAnim !== 'heloise_jump') this.bot.play('heloise_jump', true);
    else if (this.bot.state === 'dash' && bCurrentAnim !== 'heloise_dash') this.bot.play('heloise_dash', true);
  }

  endGame() {
    this.gameOver = true;
    this.scene.stop('HUD');
    this.sound.stopAll();

    // Determine the winner and switch to appropriate scene
    if (this.gameTime <= 0) {
      // Time's up - determine winner by health
      if (this.player.health > this.bot.health) {
        this.time.delayedCall(300, () => { this.scene.start('GameWin'); });
      } else if (this.bot.health > this.player.health) {
        this.time.delayedCall(300, () => { this.scene.start('GameOver'); });
      } else {
        // Tie - player wins by default
        this.time.delayedCall(300, () => { this.scene.start('GameWin'); });
      }
    } else if (this.player.isAlive) {
      // Player wins
      this.time.delayedCall(300, () => { this.scene.start('GameWin'); });
    } else {
      // Player dies -> game over
      this.time.delayedCall(300, () => { this.scene.start('GameOver'); });
    }
  }
}
