import Bot from './Bot.js';

// Le père : boss final de l'acte III, 3 phases selon sa santé.
export default class Boss extends Bot {
  constructor(scene, x, y, particles = null) {
    super(scene, x, y, particles);
    this.setScale(1.3);
    this.setTint(0x8a4a4a);
    this.health = 250; this.maxHealth = 250;
    this.attackRange = 90;
    this.attackCooldown = 1100;
    this.damageScale = 0.7;
    this.phase = 1;
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
      this.setTint(0xb04040);
    } else if (this.phase === 3) {
      this.attackCooldown = 600; this.speed = 320; this.damageScale = 1.1;
      this.setTint(0xd02020);
    }
  }
}
