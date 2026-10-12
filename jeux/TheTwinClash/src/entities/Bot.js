import Fighter from './Fighter.js';
export default class Bot extends Fighter {
  constructor(scene, x, y, particles=null) {
    super(scene, x, y, 'heloise_fighter');
    this.particles = particles;
    this.attackTimer = 0;
    this.attackCooldown = 800;
    this.facing = 'left';
    this.setScale(1);
    this.dashTimer = 0;
    this.evadeTimer = 0;
    this.comboStage = 0;
  }

  update(player) {
    if (!this.isAlive) return;
    this.updateState();
    const now = this.scene.time.now;
    // Use horizontal distance so the bot stays on its Y axis (doesn't follow player's jump)
    const dx = Math.abs(this.x - player.x);

    // Facing (based on X only)
    this.facing = (this.x < player.x) ? 'right' : 'left';
    this.setFlipX(this.facing === 'left');

    // Decision making (move only on X, keep Y locked)
    if (this.state === 'idle' || this.state === 'run') {
      // Ensure Y velocity is zero so bot stays on its original Y
      this.setVelocityY(0);
      // If far, approach horizontally
      if (dx > 160) {
        const dir = this.x < player.x ? 1 : -1;
        this.setVelocityX(dir * this.speed * 0.6);
        this.play('heloise_walk', true);
        this.setState('run');
      } else if (dx > this.attackRange + 20) {
        // short horizontal approach
        const dir = this.x < player.x ? 1 : -1;
        this.setVelocityX(dir * this.speed * 0.4);
        this.play('heloise_walk', true);
        this.setState('run');
      } else {
        this.setVelocityX(0);
        this.play('heloise_idle', true);
        this.setState('idle');
      }
    }

    // Random dash to close gap or escape if low health
    if (now > this.dashTimer && Math.random() < 0.01) {
      this.doDash(player);
      this.dashTimer = now + 1500 + Math.random()*2000;
    }

    // Evade when close and recently hit (use horizontal distance)
    if (this.state !== 'stun' && dx < 60 && Math.random() < 0.02) {
      this.doEvade();
    }

    // Attack when horizontally in range and cooldown passed (ignore vertical separation)
    if (dx <= this.attackRange && now > this.attackTimer) {
      this.attackTimer = now + this.attackCooldown;
      // choose attack pattern: combo, heavy, or quick
      const r = Math.random();
      if (r < 0.2) this.doHeavy(player);
      else if (r < 0.6) this.doCombo(player);
      else this.doQuick(player);
    }
  }

  doQuick(player) {
    this.setState('attack', 250);
    this.play('heloise_punch', true);
    this.scene.time.delayedCall(120, () => {
      if (Math.abs(this.x - player.x) <= this.attackRange) { player.takeDamage(6, true); this.spawnHit(player); }
    });
  }

  doCombo(player) {
    this.setState('attack', 450);
    this.play('heloise_punch', true);
    // two quick hits
    this.scene.time.delayedCall(100, () => { if (Math.abs(this.x - player.x) <= this.attackRange) { player.takeDamage(6, true); this.spawnHit(player); } });
    this.scene.time.delayedCall(260, () => { if (Math.abs(this.x - player.x) <= this.attackRange) { player.takeDamage(5, true); this.spawnHit(player); } });
  }

  doHeavy(player) {
    this.setState('attack', 500);
    this.play('heloise_punch', true);
    this.scene.time.delayedCall(260, () => {
      if (Math.abs(this.x - player.x) <= this.attackRange) { player.takeDamage(14, true); this.spawnHit(player, true); }
    });
  }

  doDash(player) {
    // dash toward player or away if low HP
    const toward = (this.health > this.maxHealth * 0.35);
    const dir = toward ? (this.x < player.x ? 1 : -1) : (this.x < player.x ? -1 : 1);
    this.setState('dash', 600);
    this.scene.sound.play('dash');
    const dashDistance = 350; // pixels to dash
    
    // Tween the position for a fixed dash distance
    this.scene.tweens.add({
      targets: this,
      x: this.x + (dir * dashDistance),
      duration: 600,
      ease: 'Power2'
    });
    
    if (this.particles) {
      const e = this.particles.createEmitter({ x: this.x, y: this.y+30, speed:{min:-20,max:20}, lifespan:200, scale:{start:0.6,end:0}, quantity:6 });
      this.scene.time.delayedCall(350, () => e.stop());
    }
  }

  doEvade() {
    this.setState('dash', 600);
    // quick lateral movement
    const dir = Math.random() < 0.5 ? -1 : 1;
    const evadeDistance = 250; // pixels to evade
    
    this.scene.tweens.add({
      targets: this,
      x: this.x + (dir * evadeDistance),
      duration: 600,
      ease: 'Power2'
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
