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
    this.health = 250; this.maxHealth = 250;
    this.attackRange = 100;
    this.attackCooldown = 1100;
    this.damageScale = 0.7;
    this.phase = 1;
    this.play('pere_idle', true);
  }

  update(target) {
    const ratio = this.health / this.maxHealth;
    const phase = ratio > 2 / 3 ? 1 : (ratio > 1 / 3 ? 2 : 3);
    if (phase !== this.phase && this.isAlive) {
      this.phase = phase;
      this.applyPhase();
      if (this.scene.onBossPhase) this.scene.onBossPhase(phase);
    }
    super.update(target);
  }

  applyPhase() {
    if (this.phase === 2) {
      this.attackCooldown = 800; this.speed = 260; this.damageScale = 0.9;
    } else if (this.phase === 3) {
      this.attackCooldown = 600; this.speed = 320; this.damageScale = 1.1;
    }
  }

  die() {
    this.isAlive = false;
    this.setVelocity(0);
    this.setState('dead');
    this.play('boss_death');
    this.setTint(0x666666);
  }
}
