import Bot from './Bot.js';

// Le père : boss final de l'acte III, 3 phases selon sa santé.
export default class Boss extends Bot {
  constructor(scene, x, y, particles = null) {
    super(scene, x, y, particles, 'pere_fighter');
    this.animPrefix = 'pere';
    this.clearTint();
    this.setScale(2.2);
    if (this.body) {
      this.body.setSize(60, 115, true);
    }
    this.health = 260;
    this.maxHealth = 260;
    this.attackRange = 110;
    this.attackCooldown = 1100;
    this.damageScale = 0.8;
    this.phase = 1;
    this.bulletTimer = 0;
    this.bulletCooldown = 4200;
    this.facing = 'left';
    this.setFlipX(true);
    this.play('pere_idle', true);
  }

  update(target) {
    if (!this.isAlive || !target) return;

    const ratio = this.health / this.maxHealth;
    const phase = ratio > 2 / 3 ? 1 : (ratio > 1 / 3 ? 2 : 3);
    if (phase !== this.phase && this.isAlive) {
      this.phase = phase;
      this.applyPhase();
      if (this.scene.onBossPhase) this.scene.onBossPhase(phase);
    }

    this.updateState();
    const now = this.scene.time.now;
    const dx = Math.abs(this.x - target.x);

    // Orientation
    this.facing = (this.x < target.x) ? 'right' : 'left';
    this.setFlipX(this.facing === 'left');

    const blockedStates = ['attack', 'kick', 'dash', 'special', 'stun', 'dead'];
    if (!blockedStates.includes(this.state)) {
      this.setVelocityY(0);

      // Tir de projectile 'bullet' (au ras du sol : à esquiver par saut ou dash !)
      if (now > this.bulletTimer && (dx > 180 || Math.random() < 0.03)) {
        this.bulletTimer = now + this.bulletCooldown + Math.random() * 1500;
        this.doShootBullet(target);
        return;
      }

      // Déplacement
      if (dx > 170) {
        const dir = this.x < target.x ? 1 : -1;
        this.setVelocityX(dir * this.speed * 0.7);
        this.play('pere_walk', true);
        this.setState('run');
      } else if (dx > this.attackRange + 10) {
        const dir = this.x < target.x ? 1 : -1;
        this.setVelocityX(dir * this.speed * 0.5);
        this.play('pere_walk', true);
        this.setState('run');
      } else {
        this.setVelocityX(0);
        this.play('pere_idle', true);
        this.setState('idle');
      }
    } else {
      this.setVelocityX(0);
    }

    // Dash / Charge offensive
    if (!blockedStates.includes(this.state) && now > this.dashTimer && Math.random() < 0.015) {
      this.doDash(target);
      this.dashTimer = now + (this.phase === 3 ? 1800 : 2800);
    }

    // Attaque au corps à corps
    if (!blockedStates.includes(this.state) && dx <= this.attackRange + 15 && now > this.attackTimer) {
      this.attackTimer = now + this.attackCooldown;
      const r = Math.random();
      if (r < 0.35) this.doHeavy(target);
      else if (r < 0.75) this.doCombo(target);
      else this.doQuick(target);
    }
  }

  doShootBullet(target) {
    this.setState('special', 600);
    this.play('pere_special', true);
    if (this.scene.sound) this.scene.sound.play('special');

    // Aura rouge d'avertissement pour anticiper le saut ou le dash
    this.flashDamage(0xff3333, 200);
    if (this.particles) {
      const warn = this.particles.createEmitter({
        x: this.x + (this.facing === 'right' ? 40 : -40),
        y: this.y + 10,
        speed: { min: -100, max: 100 },
        lifespan: 250,
        scale: { start: 1.2, end: 0 },
        quantity: 10
      });
      this.scene.time.delayedCall(200, () => warn.stop());
    }

    // Lancement du projectile au sol
    this.scene.time.delayedCall(220, () => {
      if (!this.isAlive) return;
      const bulletSpeed = this.phase === 3 ? 550 : (this.phase === 2 ? 480 : 420);
      const bulletDmg = (18 + this.phase * 3) * this.damageScale;
      if (this.scene.spawnBossBullet) {
        this.scene.spawnBossBullet(this, bulletDmg, bulletSpeed);
      }

      // En Phase 3 : chance de deuxième tir rapide
      if (this.phase === 3 && Math.random() < 0.5) {
        this.scene.time.delayedCall(300, () => {
          if (this.isAlive && this.scene.spawnBossBullet) {
            this.scene.spawnBossBullet(this, bulletDmg * 0.8, bulletSpeed + 50);
          }
        });
      }
    });
  }

  doQuick(target) {
    this.setState('attack', 280);
    this.play('pere_punch', true);
    if (this.scene.sound) this.scene.sound.play('punch');
    this.scene.time.delayedCall(120, () => {
      if (this.isInHitbox(target, 110, 85)) {
        const hit = target.takeDamage(10 * this.damageScale, 220, 50, this.x, false);
        if (hit) this.spawnHit(target, false);
      }
    });
  }

  doCombo(target) {
    this.setState('attack', 500);
    this.play('pere_punch', true);
    if (this.scene.sound) this.scene.sound.play('punch');
    this.scene.time.delayedCall(120, () => {
      if (this.isInHitbox(target, 110, 85)) {
        const hit = target.takeDamage(8 * this.damageScale, 200, 35, this.x, false);
        if (hit) this.spawnHit(target, false);
      }
    });
    this.scene.time.delayedCall(280, () => {
      if (this.isAlive && this.isInHitbox(target, 115, 90)) {
        if (this.scene.sound) this.scene.sound.play('punch');
        const hit = target.takeDamage(12 * this.damageScale, 320, 85, this.x, false);
        if (hit) this.spawnHit(target, true);
      }
    });
  }

  doHeavy(target) {
    this.setState('kick', 450);
    this.play('pere_kick', true);
    if (this.scene.sound) this.scene.sound.play('kick');
    this.scene.time.delayedCall(200, () => {
      if (this.isInHitbox(target, 125, 90)) {
        const hit = target.takeDamage(20 * this.damageScale, 450, 140, this.x, true);
        if (hit) {
          this.spawnHit(target, true);
          if (this.scene.cameras.main) this.scene.cameras.main.shake(140, 0.007);
        }
      }
    });
  }

  applyPhase() {
    if (this.phase === 2) {
      this.attackCooldown = 850;
      this.bulletCooldown = 3200;
      this.speed = 260;
      this.damageScale = 0.95;
    } else if (this.phase === 3) {
      this.attackCooldown = 650;
      this.bulletCooldown = 2200;
      this.speed = 320;
      this.damageScale = 1.15;
    }
  }

  die() {
    this.isAlive = false;
    this.setVelocity(0);
    this.setState('dead');
    if (this.knockbackTween) {
      this.knockbackTween.stop();
      this.knockbackTween = null;
    }
    this.play('boss_death');
    this.setTint(0x666666);
  }
}
