import Player from '../entities/Player.js';
import Bot from '../entities/Bot.js';
import Boss from '../entities/Boss.js';
import Barks from '../ui/Barks.js';
import { BARKS, STEPS, runStep, stepTarget } from '../story/storyScript.js';
import TouchControls from '../ui/TouchControls.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  create(data) {
    // background
    this.add.image(480, 270, 'bg').setDisplaySize(this.scale.width, this.scale.height);

    // background music (on coupe tout avant, pour éviter un double lancement)
    this.sound.stopAll();
    this.gameSceneMusic = this.sound.add('bgmCombat', { loop: true, volume: 0.5 });
    this.gameSceneMusic.play();

    // particle manager for hits/trails
    this.particles = this.add.particles('hit');

    // Determine game mode
    this.story = (data && data.story) || null;
    this.gameOver = false;
    this.gameTime = 90; // Initialize game time
    this.ally = null;
    this.noTimer = false;
    let hudNames = null;

    if (this.story) {
      this.displayMode = 'STORY';
      this.barks = new Barks(this);
      this.player = new Player(this, 180, 420, this.particles);
      if (this.story.act === 1) {
        // Acte I : tenir jusqu'à la fin du chronomètre sans qu'aucune des sœurs ne tombe
        this.bot = new Bot(this, 760, 420, this.particles);
        this.bot.damageScale = 0.35;      // Héloïse se retient
        this.bot.damageTakenScale = 0.3;  // et on ne veut pas la blesser
        this.gameTime = 45;
        hudNames = { player: 'ADÈLE', bot: 'HÉLOÏSE' };
        BARKS.act1.forEach(b => this.time.delayedCall(b.at, () => this.barks.say(b.lines)));
      } else {
        // Acte III : boss final (le père), Héloïse combat aux côtés d'Adèle
        this.player.x = 220;
        this.ally = new Bot(this, 110, 420, this.particles);
        this.ally.damageScale = 0.8;
        this.bot = new Boss(this, 780, 413, this.particles);
        this.noTimer = true;
        hudNames = { player: 'ADÈLE', bot: 'LE PÈRE', ally: 'HÉLOÏSE' };
        this.time.delayedCall(800, () => this.barks.say(BARKS.act3[1]));
      }
    } else {
      // Mode Combat : Adèle vs Héloïse
      this.player = new Player(this, 180, 420, this.particles);
      this.bot = new Bot(this, 760, 420, this.particles);
      this.displayMode = 'BOT';
      hudNames = { player: 'ADÈLE', bot: 'HÉLOÏSE' };
    }

    // Joystick + boutons d'action sur mobile
    this.touch = TouchControls.supported(this) ? new TouchControls(this, [
      { key: 'punch', label: 'POING', x: 860, y: 450, r: 48, color: 0xe74c3c },
      { key: 'kick', label: 'PIED', x: 750, y: 480, r: 40, color: 0xf39c12 },
      { key: 'special', label: 'SPÉ', x: 860, y: 340, r: 38, color: 0x9b59b6 },
      { key: 'dash', label: 'DASH', x: 750, y: 380, r: 36, color: 0x3498db }
    ]) : null;

    this.player.setCollideWorldBounds(true);
    this.bot.setCollideWorldBounds(true);
    if (this.ally) this.ally.setCollideWorldBounds(true);

    // small world bounds floor
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    // launch HUD and pass references
    this.scene.launch('HUD', { player: this.player, bot: this.bot, gameScene: this, ally: this.ally, noTimer: this.noTimer, names: hudNames });

    this.cameras.main.setBackgroundColor('#10131a');
  }

  update() {
    if (this.gameOver) return;

    if (this.story) {
      this.updateStory();
      return;
    }

    this.player.update(this.bot);
    this.bot.update(this.player);

    // play proper animations according to state
    this.syncAnimations();

    if (!this.player.isAlive || !this.bot.isAlive) this.endGame();
  }

  updateStory() {
    if (this.story.act === 1) {
      this.player.update(this.bot);
      this.bot.update(this.player);
      this.syncAnimations();
      if (!this.player.isAlive || !this.bot.isAlive) this.endGame();
      return;
    }

    // Acte III
    this.player.update(this.bot);
    this.ally.update(this.bot);
    const sisters = [this.player, this.ally].filter(s => s.isAlive);
    if (sisters.length) {
      const target = sisters.reduce((a, b) => Math.abs(a.x - this.bot.x) <= Math.abs(b.x - this.bot.x) ? a : b);
      this.bot.update(target);
    }
    this.syncAnimations();

    if (!this.bot.isAlive || sisters.length === 0) this.endGame();
  }

  // Appelé par le boss lors d'un changement de phase
  onBossPhase(phase) {
    if (this.barks && BARKS.act3[phase]) this.barks.say(BARKS.act3[phase]);
  }

  syncAnimations() {
    // player
    if (this.player && this.player.isAlive) {
      const p = this.player;
      const pAnim = p.anims.currentAnim?.key;
      
      if (p.state === 'idle' && pAnim !== 'adele_idle') p.play('adele_idle', true);
      else if (p.state === 'run' && pAnim !== 'adele_walk') p.play('adele_walk', true);
      else if (p.state === 'attack' && pAnim !== 'adele_punch') p.play('adele_punch', true);
      else if (p.state === 'kick' && pAnim !== 'adele_kick') p.play('adele_kick', true);
      else if (p.state === 'jump' && pAnim !== 'adele_jump') p.play('adele_jump', true);
      else if (p.state === 'dash' && pAnim !== 'adele_dash') p.play('adele_dash', true);
      else if (p.state === 'special' && pAnim !== 'adele_special_move') p.play('adele_special_move', true);
      else if (p.state === 'stun' && pAnim !== 'adele_hurt_block') p.play('adele_hurt_block', true);
    }
    
    // bot / boss
    this.syncBotAnim(this.bot);

    // ally (Héloïse in Act III)
    if (this.ally) {
      this.syncBotAnim(this.ally);
    }
  }

  syncBotAnim(bot) {
    if (!bot || !bot.isAlive) return;
    const prefix = bot.animPrefix || 'heloise';
    const currentAnim = bot.anims.currentAnim?.key;
    
    if (bot.state === 'idle' && currentAnim !== `${prefix}_idle`) bot.play(`${prefix}_idle`, true);
    else if (bot.state === 'run' && currentAnim !== `${prefix}_walk`) bot.play(`${prefix}_walk`, true);
    else if (bot.state === 'attack' && currentAnim !== `${prefix}_punch`) bot.play(`${prefix}_punch`, true);
    else if (bot.state === 'kick' && currentAnim !== `${prefix}_kick`) bot.play(`${prefix}_kick`, true);
    else if (bot.state === 'jump' && currentAnim !== `${prefix}_jump`) bot.play(`${prefix}_jump`, true);
    else if (bot.state === 'dash' && currentAnim !== `${prefix}_dash`) bot.play(`${prefix}_dash`, true);
    else if (bot.state === 'stun') {
      const hurtKey = this.anims.exists(`${prefix}_hurt_block`) ? `${prefix}_hurt_block` : `${prefix}_hurt`;
      if (this.anims.exists(hurtKey) && currentAnim !== hurtKey) bot.play(hurtKey, true);
    }
  }

  endStory() {
    this.gameOver = true;
    this.scene.stop('HUD');
    this.sound.stopAll();

    const step = STEPS[this.story.step];
    const win = this.story.act === 1
      ? (this.player.isAlive && this.bot.isAlive)
      : (!this.bot.isAlive && (this.player.isAlive || this.ally.isAlive));

    if (win) {
      this.time.delayedCall(this.story.act === 1 ? 800 : 1500, () => runStep(this, step.next));
    } else {
      this.time.delayedCall(300, () => {
        this.scene.start('GameOver', {
          retry: stepTarget(this.story.step),
          message: this.story.act === 1 ? 'L\'une des sœurs est tombée au combat...' : 'Le Père l\'a emporté...'
        });
      });
    }
  }

  endGame() {
    if (this.story) { this.endStory(); return; }

    this.gameOver = true;
    this.scene.stop('HUD');
    this.sound.stopAll();

    // Determine the winner and switch to appropriate scene
    if (this.gameTime <= 0) {
      // Time's up - determine winner by health
      if (this.player.health > this.bot.health) {
        this.time.delayedCall(300, () => { this.scene.start('GameWin', { message: 'Adèle l\'emporte aux points !' }); });
      } else if (this.bot.health > this.player.health) {
        this.time.delayedCall(300, () => { this.scene.start('GameOver', { message: 'Héloïse l\'emporte aux points !' }); });
      } else {
        // Tie
        this.time.delayedCall(300, () => { this.scene.start('GameWin', { message: 'Égalité parfaite !' }); });
      }
    } else if (this.player.isAlive) {
      // Player wins
      this.time.delayedCall(300, () => { this.scene.start('GameWin', { message: 'Adèle a vaincu Héloïse !' }); });
    } else {
      // Player dies -> game over
      this.time.delayedCall(300, () => { this.scene.start('GameOver', { message: 'Héloïse a vaincu Adèle !' }); });
    }
  }
}
