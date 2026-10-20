export default class Fighter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.health = 100; this.maxHealth = 100; this.speed = 220; this.attackRange = 70;
    this.isAlive = true;
    this.damageScale = 1;      // multiplicateur des dégâts infligés (mode histoire)
    this.damageTakenScale = 1; // multiplicateur des dégâts reçus (mode histoire)
    this.state = 'idle'; // idle, run, attack, stun, dash, special
    this.stateTimer = 0;
  }

  setState(state, duration=0) {
    this.state = state;
    this.stateTimer = duration > 0 ? this.scene.time.now + duration : 0;
  }

  updateState() {
    if (this.stateTimer && this.scene.time.now > this.stateTimer) {
      // return to idle if timer expired and still alive
      if (this.isAlive) this.setState('idle');
      this.stateTimer = 0;
    }
  }

  takeDamage(amount, stun=false) {
    if (!this.isAlive) return;
    this.health = Math.max(0, this.health - amount * this.damageTakenScale);
    if (stun) this.setState('stun', 500);
    if (this.health <= 0) this.die();
  }

  die() {
    this.isAlive = false;
    this.setVelocity(0);
    this.setState('dead');
    this.play(this.texture.key.includes('player') ? 'player_death' : 'bot_death');
    this.setTint(0x666666);
  }

  isInRange(target) {
    return Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <= this.attackRange;
  }
}
