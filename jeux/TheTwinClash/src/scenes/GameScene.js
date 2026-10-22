import Player from '../entities/Player.js';
import Bot from '../entities/Bot.js';
import Boss from '../entities/Boss.js';
import Barks from '../ui/Barks.js';
import { BARKS, STEPS, runStep, stepTarget } from '../story/storyScript.js';
import TouchControls from '../ui/TouchControls.js';
import runCountdown from '../ui/Countdown.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  create(data) {
    // background
    this.add.image(480, 270, 'bg').setDisplaySize(this.scale.width, this.scale.height);

    // background music (on coupe tout avant, pour éviter un double lancement)
    this.sound.stopAll();
    // Acte III (boss final) : musique du boss ; sinon musique de combat
    const isBoss = !!(data && data.story && data.story.act === 3);
    this.gameSceneMusic = this.sound.add(isBoss ? 'bgmBoss' : 'bgmCombat', { loop: true, volume: 0.5 });
    this.gameSceneMusic.play();

    // particle manager for hits/trails
    this.particles = this.add.particles('hit');

    // Liste des projectiles actifs de combat (boules de feu, boss bullets)
    this.combatProjectiles = [];

    // Determine game mode
    this.story = (data && data.story) || null;
    this.gameOver = false;
    this.started = false; // passe à true à la fin du compte à rebours
    this.gameTime = 90; // Initialize game time
    this.ally = null;
    this.noTimer = false;
    let hudNames = null;

    if (this.story) {
      this.displayMode = 'STORY';
      this.barks = new Barks(this);
      this.player = new Player(this, 180, 420, this.particles);
      this.player.facing = 'right';
      this.player.setFlipX(false);

      if (this.story.act === 1) {
        // Acte I : tenir jusqu'à la fin du chronomètre sans qu'aucune des sœurs ne tombe
        this.bot = new Bot(this, 760, 420, this.particles);
        this.bot.facing = 'left';
        this.bot.setFlipX(true);
        this.bot.damageScale = 0.35;      // Héloïse se retient
        this.bot.damageTakenScale = 0.3;  // et on ne veut pas la blesser
        this.gameTime = 45;
        hudNames = { player: 'ADÈLE', bot: 'HÉLOÏSE' };
        this.onStart = () => BARKS.act1.forEach(b => this.time.delayedCall(b.at, () => this.barks.say(b.lines)));
      } else {
        // Acte III : boss final (le père), Héloïse combat aux côtés d'Adèle
        this.player.x = 220;
        this.player.facing = 'right';
        this.player.setFlipX(false);

        this.ally = new Bot(this, 110, 420, this.particles);
        this.ally.facing = 'right';
        this.ally.setFlipX(false);
        this.ally.damageScale = 0.8;

        this.bot = new Boss(this, 780, 413, this.particles);
        this.bot.facing = 'left';
        this.bot.setFlipX(true);

        this.noTimer = true;
        hudNames = { player: 'ADÈLE', bot: 'LE PÈRE', ally: 'HÉLOÏSE' };
        this.onStart = () => this.time.delayedCall(800, () => this.barks.say(BARKS.act3[1]));
      }
    } else {
      // Mode Combat : Adèle vs Héloïse
      this.player = new Player(this, 180, 420, this.particles);
      this.player.facing = 'right';
      this.player.setFlipX(false);

      this.bot = new Bot(this, 760, 420, this.particles);
      this.bot.facing = 'left';
      this.bot.setFlipX(true);

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

    // Compte à rebours : le combat (et le chronomètre) démarre à "FIGHT !"
    runCountdown(this, () => {
      this.started = true;
      if (this.onStart) this.onStart();
    });
  }

  update() {
    if (this.gameOver || !this.started) return;

    if (this.story) {
      this.updateStory();
    } else {
      this.player.update(this.bot);
      this.bot.update(this.player);
      this.syncAnimations();
      if (!this.player.isAlive || !this.bot.isAlive) this.endGame();
    }

    // Gestion et collisions des projectiles actifs
    this.updateProjectiles();
  }

  updateStory() {
    if (this.story.act === 1) {
      this.player.update(this.bot);
      this.bot.update(this.player);
      this.syncAnimations();
      if (!this.player.isAlive || !this.bot.isAlive) this.endGame();
      return;
    }

    // Acte III (Boss Le Père)
    this.player.update(this.bot);
    if (this.ally && this.ally.isAlive) {
      this.ally.update(this.bot);
    }
    const sisters = [this.player, this.ally].filter(s => s && s.isAlive);
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

  // Lancement de boule de feu magique (Adèle ou Héloïse)
  spawnFireball(owner, textureKey, damage, speed = 520) {
    const dir = owner.facing === 'right' ? 1 : -1;
    const startX = owner.x + dir * 40;
    const startY = owner.y - 10;

    const sprite = this.physics.add.sprite(startX, startY, textureKey);
    sprite.setScale(1.2);
    sprite.setDepth(15);
    sprite.setFlipX(dir < 0);
    sprite.body.setAllowGravity(false);
    sprite.body.setVelocityX(dir * speed);
    sprite.body.setSize(30, 30);

    // Émetteur de traînée de particules
    let trail = null;
    if (this.particles) {
      trail = this.particles.createEmitter({
        x: startX,
        y: startY,
        speed: { min: -20, max: 20 },
        lifespan: 180,
        scale: { start: 0.6, end: 0 },
        quantity: 2
      });
      trail.startFollow(sprite);
    }

    const projectile = {
      type: 'fireball',
      sprite: sprite,
      owner: owner,
      damage: damage,
      dir: dir,
      trail: trail,
      createdAt: this.time.now
    };

    this.combatProjectiles.push(projectile);
  }

  // Lancement du projectile au ras du sol par le Boss Père (à esquiver par saut ou dash !)
  spawnBossBullet(boss, damage, speed = 460) {
    const dir = boss.facing === 'right' ? 1 : -1;
    const startX = boss.x + dir * 55;
    const startY = 422; // Au niveau du sol

    const sprite = this.physics.add.sprite(startX, startY, 'bullet');
    sprite.setScale(1.6);
    sprite.setDepth(15);
    sprite.setFlipX(dir < 0);
    sprite.body.setAllowGravity(false);
    sprite.body.setVelocityX(dir * speed);
    sprite.body.setSize(35, 25);

    // Traînée de particules rouges / ondes de choc au sol
    let trail = null;
    if (this.particles) {
      trail = this.particles.createEmitter({
        x: startX,
        y: startY + 10,
        speed: { min: -40, max: 40 },
        lifespan: 160,
        scale: { start: 0.8, end: 0 },
        quantity: 3
      });
      trail.startFollow(sprite);
    }

    const projectile = {
      type: 'bossBullet',
      sprite: sprite,
      owner: boss,
      damage: damage,
      dir: dir,
      trail: trail,
      createdAt: this.time.now
    };

    this.combatProjectiles.push(projectile);
  }

  updateProjectiles() {
    const now = this.time.now;
    for (let i = this.combatProjectiles.length - 1; i >= 0; i--) {
      const p = this.combatProjectiles[i];
      if (!p.sprite || !p.sprite.active) {
        this.destroyProjectile(p, i);
        continue;
      }

      // Sortie de l'écran ou timeout (après 2.5 secondes)
      if (p.sprite.x < -60 || p.sprite.x > this.scale.width + 60 || now - p.createdAt > 2500) {
        this.destroyProjectile(p, i);
        continue;
      }

      // Détection des cibles selon le propriétaire
      let targets = [];
      if (p.type === 'bossBullet') {
        // La bullet du Boss vise Adèle et Héloïse
        if (this.player && this.player.isAlive) targets.push(this.player);
        if (this.ally && this.ally.isAlive) targets.push(this.ally);
      } else if (p.owner === this.player) {
        if (this.bot && this.bot.isAlive) targets.push(this.bot);
      } else if (p.owner === this.ally) {
        if (this.bot && this.bot.isAlive) targets.push(this.bot);
      } else if (p.owner === this.bot) {
        if (this.player && this.player.isAlive) targets.push(this.player);
        if (this.ally && this.ally.isAlive) targets.push(this.ally);
      }

      // Test de collision avec chaque cible
      for (const target of targets) {
        if (!target.isAlive) continue;

        const dx = Math.abs(p.sprite.x - target.x);
        const dy = Math.abs(p.sprite.y - target.y);

        // Si la bullet du boss est au sol (y ~ 422), et que la cible saute haut (y < 355), la bullet passe sous les pieds !
        if (p.type === 'bossBullet') {
          if (target.isJumping || target.y < 355) {
            // Esquive réussie par le saut, la bullet continue son chemin
            continue;
          }
        }

        // Portée de contact
        if (dx < 42 && dy < 75) {
          // Si la cible dashe (i-frames d'esquive), elle traverse le projectile sans subir de dégâts
          if (target.isInvincible || target.state === 'dash') {
            target.showDodgeText();
            continue;
          }

          // Impact réussi !
          const isBossBullet = (p.type === 'bossBullet');
          const knockback = isBossBullet ? 150 : 120;
          const stunDuration = isBossBullet ? 400 : 350;

          target.takeDamage(p.damage, stunDuration, knockback, p.owner.x, true);

          // Effets visuels et sonores d'impact
          this.createImpactEffect(p.sprite.x, p.sprite.y, isBossBullet);
          if (this.cameras.main) {
            this.cameras.main.shake(120, isBossBullet ? 0.008 : 0.005);
          }

          this.destroyProjectile(p, i);
          break;
        }
      }
    }
  }

  createImpactEffect(x, y, isHeavy = false) {
    const s = this.add.sprite(x, y, 'hit').setScale(isHeavy ? 1.4 : 1.0).setDepth(25);
    this.tweens.add({ targets: s, alpha: 0, duration: 250, onComplete: () => s.destroy() });

    if (this.particles) {
      const expl = this.particles.createEmitter({
        x: x,
        y: y,
        speed: { min: -120, max: 120 },
        lifespan: 300,
        scale: { start: isHeavy ? 1.2 : 0.8, end: 0 },
        quantity: isHeavy ? 14 : 8
      });
      this.time.delayedCall(200, () => expl.stop());
    }
  }

  destroyProjectile(p, index) {
    if (p.trail) {
      p.trail.stop();
      this.time.delayedCall(200, () => {
        if (p.trail) p.trail.remove();
      });
    }
    if (p.sprite) {
      p.sprite.destroy();
    }
    this.combatProjectiles.splice(index, 1);
  }

  cleanAllProjectiles() {
    for (let i = this.combatProjectiles.length - 1; i >= 0; i--) {
      this.destroyProjectile(this.combatProjectiles[i], i);
    }
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
    else if (bot.state === 'special' && currentAnim !== `${prefix}_special_move` && currentAnim !== `${prefix}_special`) {
      const specAnim = this.anims.exists(`${prefix}_special_move`) ? `${prefix}_special_move` : `${prefix}_special`;
      if (this.anims.exists(specAnim)) bot.play(specAnim, true);
    }
    else if (bot.state === 'stun') {
      const hurtKey = this.anims.exists(`${prefix}_hurt_block`) ? `${prefix}_hurt_block` : `${prefix}_hurt`;
      if (this.anims.exists(hurtKey) && currentAnim !== hurtKey) bot.play(hurtKey, true);
    }
  }

  endStory() {
    this.gameOver = true;
    this.cleanAllProjectiles();
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
    this.cleanAllProjectiles();
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
