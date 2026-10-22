import Fighter from './Fighter.js';

export default class Bot extends Fighter {
  constructor(scene, x, y, particles = null, texture = 'heloise_fighter') {
    super(scene, x, y, texture);
    this.particles = particles;
    this.attackTimer = 0;
    this.attackCooldown = 800;
    this.facing = 'left';
    this.setFlipX(true);
    this.setScale(1);
    this.dashTimer = 0;
    this.evadeTimer = 0;
    this.specialTimer = 0;
    this.specialCooldown = 4500;
    // Préfixe d'animation : peut être surchargé par les sous-classes (ex: Boss → 'pere')
    this.animPrefix = texture === 'pere_fighter' ? 'pere' : 'heloise';
    this.play(`${this.animPrefix}_idle`, true);
  }

  update(player) {
    if (!this.isAlive || !player) return;
    this.updateState();
    const now = this.scene.time.now;
    const dx = Math.abs(this.x - player.x);

    // Orientation vers la cible
    this.facing = (this.x < player.x) ? 'right' : 'left';
    this.setFlipX(this.facing === 'left');

    const blockedStates = ['attack', 'kick', 'dash', 'special', 'stun', 'dead'];
    if (!blockedStates.includes(this.state)) {
      this.setVelocityY(0);

      // Opportunité d'attaque spéciale à distance pour Héloïse
      if (this.animPrefix === 'heloise' && dx > 180 && dx < 600 && now > this.specialTimer && Math.random() < 0.035) {
        this.specialTimer = now + this.specialCooldown + Math.random() * 2000;
        this.doSpecial(player);
        return;
      }

      // Déplacement horizontal
      if (dx > 160) {
        const dir = this.x < player.x ? 1 : -1;
        this.setVelocityX(dir * this.speed * 0.65);
        this.play(`${this.animPrefix}_walk`, true);
        this.setState('run');
      } else if (dx > this.attackRange + 15) {
        const dir = this.x < player.x ? 1 : -1;
        this.setVelocityX(dir * this.speed * 0.45);
        this.play(`${this.animPrefix}_walk`, true);
        this.setState('run');
      } else {
        this.setVelocityX(0);
        this.play(`${this.animPrefix}_idle`, true);
        this.setState('idle');
      }
    } else {
      this.setVelocityX(0);
    }

    // Dash / Approche rapide ou retraite
    if (!blockedStates.includes(this.state) && now > this.dashTimer && Math.random() < 0.012) {
      this.doDash(player);
      this.dashTimer = now + 2000 + Math.random() * 2500;
    }

    // Esquive si très proche
    if (this.state !== 'stun' && this.state !== 'dash' && dx < 60 && Math.random() < 0.02) {
      this.doEvade();
    }

    // Attaques au corps à corps
    if (!blockedStates.includes(this.state) && dx <= this.attackRange + 10 && now > this.attackTimer) {
      this.attackTimer = now + this.attackCooldown;
      const r = Math.random();
      if (r < 0.25) this.doHeavy(player);
      else if (r < 0.65) this.doCombo(player);
      else this.doQuick(player);
    }
  }

  doQuick(player) {
    this.setState('attack', 250);
    this.play(`${this.animPrefix}_punch`, true);
    if (this.scene.sound) this.scene.sound.play('punch');
    this.scene.time.delayedCall(110, () => {
      if (this.isInHitbox(player, 85, 75)) {
        const hit = player.takeDamage(7 * this.damageScale, 200, 40, this.x, false);
        if (hit) this.spawnHit(player, false);
      }
    });
  }

  doCombo(player) {
    this.setState('attack', 450);
    this.play(`${this.animPrefix}_punch`, true);
    if (this.scene.sound) this.scene.sound.play('punch');
    // Premier coup
    this.scene.time.delayedCall(100, () => {
      if (this.isInHitbox(player, 85, 75)) {
        const hit = player.takeDamage(6 * this.damageScale, 200, 30, this.x, false);
        if (hit) this.spawnHit(player, false);
      }
    });
    // Deuxième coup plus appuyé
    this.scene.time.delayedCall(250, () => {
      if (this.isAlive && this.isInHitbox(player, 90, 80)) {
        if (this.scene.sound) this.scene.sound.play('punch');
        const hit = player.takeDamage(8 * this.damageScale, 300, 70, this.x, false);
        if (hit) this.spawnHit(player, true);
      }
    });
  }

  doHeavy(player) {
    this.setState('kick', 400);
    this.play(`${this.animPrefix}_kick`, true);
    if (this.scene.sound) this.scene.sound.play('kick');
    this.scene.time.delayedCall(180, () => {
      if (this.isInHitbox(player, 105, 80)) {
        const hit = player.takeDamage(15 * this.damageScale, 380, 95, this.x, true);
        if (hit) {
          this.spawnHit(player, true);
          if (this.scene.cameras.main) this.scene.cameras.main.shake(100, 0.004);
        }
      }
    });
  }

  doSpecial(player) {
    this.setState('special', 500);
    this.play(`${this.animPrefix}_special_move`, true);
    if (this.scene.sound) this.scene.sound.play('special');

    if (this.particles) {
      const aura = this.particles.createEmitter({
        x: this.x + (this.facing === 'right' ? 30 : -30),
        y: this.y,
        speed: { min: -100, max: 100 },
        lifespan: 300,
        scale: { start: 0.9, end: 0 },
        quantity: 8
      });
      this.scene.time.delayedCall(200, () => aura.stop());
    }

    this.scene.time.delayedCall(180, () => {
      if (!this.isAlive) return;
      if (this.scene.spawnFireball) {
        this.scene.spawnFireball(this, 'heloiseBullet', 24 * this.damageScale, 520);
      }
    });
  }

  doDash(player) {
    const toward = (this.health > this.maxHealth * 0.35);
    const dir = toward ? (this.x < player.x ? 1 : -1) : (this.x < player.x ? -1 : 1);
    this.setState('dash', 380);
    this.isInvincible = true;
    this.play(`${this.animPrefix}_dash`, true);
    if (this.scene.sound) this.scene.sound.play('dash');
    const dashDistance = 280;
    const targetX = Phaser.Math.Clamp(this.x + (dir * dashDistance), 60, this.scene.scale.width - 60);

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      duration: 350,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.isInvincible = false;
        if (this.isAlive && this.state === 'dash') {
          this.setState('idle');
        }
      }
    });

    if (this.particles) {
      const e = this.particles.createEmitter({
        x: this.x,
        y: this.y + 30,
        speed: { min: -25, max: 25 },
        lifespan: 200,
        scale: { start: 0.6, end: 0 },
        quantity: 5
      });
      this.scene.time.delayedCall(300, () => e.stop());
    }
  }

  doEvade() {
    this.setState('dash', 350);
    this.isInvincible = true;
    const dir = Math.random() < 0.5 ? -1 : 1;
    const evadeDistance = 220;
    const targetX = Phaser.Math.Clamp(this.x + (dir * evadeDistance), 60, this.scene.scale.width - 60);

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      duration: 320,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.isInvincible = false;
        if (this.isAlive && this.state === 'dash') {
          this.setState('idle');
        }
      }
    });
  }

  spawnHit(target, big=false) {
    const s = this.scene.add.sprite(target.x, target.y - 20, 'hit').setScale(big?1.0:0.6).setDepth(20);
    this.scene.tweens.add({ targets: s, alpha: 0, duration: 300, onComplete: () => s.destroy() });
    if (this.particles) {
      const e = this.particles.createEmitter({ x: target.x, y: target.y, speed:{min:-80,max:80}, lifespan:250, scale:{start: big?0.9:0.5, end:0}, quantity:8 });
      this.scene.time.delayedCall(220, () => e.stop());
    }
  }
}
