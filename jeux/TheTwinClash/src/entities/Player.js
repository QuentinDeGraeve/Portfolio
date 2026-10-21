import Fighter from './Fighter.js';

export default class Player extends Fighter {
  constructor(scene, x, y, particles = null) {
    super(scene, x, y, 'adele_fighter');
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // punch
    this.kickKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z); // kick
    this.specialKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.dashKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.lastAttack = 0; this.attackCooldown = 300;
    this.lastKick = 0; this.kickCooldown = 400;
    this.comboWindow = 500; this.comboCount = 0; this.comboTimer = 0;
    this.particles = particles;
    this.animPrefix = 'adele';
    this.facing = 'right';
    this.setScale(1);
    this.play('adele_idle');
    this.canMove = true;
    this.dashCooldown = 1000; this.lastDash = 0;
    this.specialCooldown = 3000; this.lastSpecial = 0;
    this.isJumping = false;
    this.jumpHeight = 200; // pixels
    this.jumpDuration = 300; // ms (up + down via yoyo)

    // Listen for animation completion to reset to idle when appropriate
    this.on('animationcomplete', this.resetToIdle, this);
  }

  update(target) {
    if (!this.isAlive) return;
    this.updateState();
    const now = this.scene.time.now;
    // Contrôles tactiles (joystick + boutons) si présents, en plus du clavier
    const t = this.scene.touch;
    const left = this.cursors.left.isDown || (t && t.left);
    const right = this.cursors.right.isDown || (t && t.right);
    const up = this.cursors.up.isDown || (t && t.up);
    const down = this.cursors.down.isDown || (t && t.down);
    const dashPressed = Phaser.Input.Keyboard.JustDown(this.dashKey) || (t && t.justDown('dash'));
    const specialPressed = Phaser.Input.Keyboard.JustDown(this.specialKey) || (t && t.justDown('special'));
    const punchPressed = Phaser.Input.Keyboard.JustDown(this.attackKey) || (t && t.justDown('punch'));
    const kickPressed = Phaser.Input.Keyboard.JustDown(this.kickKey) || (t && t.justDown('kick'));

    // movement input (allow horizontal movement during jump)
    const blockedStates = ['attack', 'kick', 'dash', 'special', 'stun', 'dead'];
    if (!blockedStates.includes(this.state)) {
      // horizontal movement
      if (left) {
        this.setVelocityX(-this.speed);
        this.facing = 'left';
        this.setFlipX(true);
        // keep jump animation active while in the air
        if (!this.isJumping) {
          this.play('adele_walk', true);
          this.setState('run');
        } else {
          this.setState('jump');
        }
      } else if (right) {
        this.setVelocityX(this.speed);
        this.facing = 'right';
        this.setFlipX(false);
        // keep jump animation active while in the air
        if (!this.isJumping) {
          this.play('adele_walk', true);
          this.setState('run');
        } else {
          this.setState('jump');
        }
      } else {
        this.setVelocityX(0);
        if (this.state !== 'idle') { this.setState('idle'); this.play('adele_idle', true); }
      }

      // vertical/simple actions
      if (up) {
        if (!this.isJumping) this.doJump();
      } else if (down) {
        this.play('adele_crouch', true);
        this.setState('crouch');
      }
    } else {
      // in other states, prevent horizontal movement only
      this.setVelocityX(0);
    }

    // dash
    if (dashPressed && now - this.lastDash > this.dashCooldown) {
      this.lastDash = now;
      this.doDash();
    }

    // special attack
    if (specialPressed && now - this.lastSpecial > this.specialCooldown) {
      this.lastSpecial = now;
      this.doSpecial(target);
    }

    // attack / combo (punch)
    if (punchPressed && now - this.lastAttack > this.attackCooldown) {
      this.lastAttack = now;
      this.doAttack(target);
      // combo management
      if (now - this.comboTimer < this.comboWindow) { this.comboCount = Math.min(this.comboCount + 1, 3); }
      else { this.comboCount = 1; }
      this.comboTimer = now;
    }

    // kick
    if (kickPressed && now - this.lastKick > this.kickCooldown) {
      this.lastKick = now;
      this.doKick(target);
    }

    // combo timeout reset
    if (this.comboCount > 0 && now - this.comboTimer > this.comboWindow) {
      this.comboCount = 0;
    }
  }

  // Fonction pour revenir à l'animation idle après une action ponctuelle
  resetToIdle(animation, frame) {
    // don't force idle while a jump tween is still active
    if (this.isJumping) return;
    if (animation.key !== 'adele_idle' && animation.key !== 'adele_walk') {
      this.play('adele_idle');
      this.setState('idle');
    }
  }

  doAttack(target) {
    if (!this.isAlive) return;
    this.setState('attack', 250);
    this.play('adele_punch', true);
    this.scene.sound.play('punch');
    // hit timing slightly delayed to appear realistic
    this.scene.time.delayedCall(120, () => {
      if (target && this.isInRange(target)) {
        const dmg = 8 + (this.comboCount - 1) * 4;
        target.takeDamage(dmg, true);
        this.spawnHit(target);
      }
    });
  }

  doKick(target) {
    if (!this.isAlive) return;
    this.setState('kick', 300);
    this.play('adele_kick', true);
    this.scene.sound.play('kick');
    this.scene.time.delayedCall(140, () => {
      if (target && this.isInRange(target)) {
        target.takeDamage(12, true);
        this.spawnHit(target);
      }
    });
  }

  doDash() {
    this.setState('dash', 600);
    this.scene.sound.play('dash');
    const dir = (this.facing === 'right') ? 1 : -1;
    const dashDistance = 350; // pixels to dash
    
    // Tween the position for a fixed dash distance
    this.scene.tweens.add({
      targets: this,
      x: this.x + (dir * dashDistance),
      duration: 600,
      ease: 'Power2'
    });
    
    if (this.particles) {
      const emitter = this.particles.createEmitter({ 
        x: this.x,
         y: this.y + 30, speed: { min: -20, max: 20 },
         lifespan: 200, scale: { start: 0.5, end: 0 },
         quantity: 4 
      });
      this.scene.time.delayedCall(350, () => { emitter.stop(); });
    }
  }

  doJump() {
    if (this.isJumping || !this.isAlive) return;
    this.isJumping = true;
    this.setState('jump', this.jumpDuration * 2);
    this.play('adele_jump', true);
    // tween Y up then down (yoyo)
    this.scene.tweens.add({
      targets: this,
      y: this.y - this.jumpHeight,
      duration: this.jumpDuration,
      ease: 'Quad.easeOut',
      yoyo: true,
      onComplete: () => {
        this.isJumping = false;
        if (this.isAlive) this.setState('idle');
      }
    });
  }

  doSpecial(target) {
    this.setState('special', 600);
    this.play('adele_special_move', true);
    this.scene.sound.play('special');
    this.scene.time.delayedCall(250, () => {
      if (target) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        if (dist < this.attackRange + 30) {
          target.takeDamage(22, true);
          this.spawnHit(target, true);
        }
      }
      if (this.particles) {
        this.particles.createEmitter({ x: this.x + (this.facing === 'right' ? 40 : -40), y: this.y, speed: { min: -200, max: 200 }, lifespan: 400, scale: { start: 1, end: 0 }, quantity: 12 }).explode(12, this.x, this.y);
      }
    });
  }

  spawnHit(target, big = false) {
    const s = this.scene.add.sprite(target.x, target.y - 20, 'hit').setScale(big ? 1.0 : 0.6).setDepth(20);
    this.scene.tweens.add({ targets: s, alpha: 0, duration: 300, onComplete: () => s.destroy() });
    if (this.particles) {
      const e = this.particles.createEmitter({ x: target.x, y: target.y, speed: { min: -80, max: 80 }, lifespan: 300, scale: { start: big ? 0.8 : 0.5, end: 0 }, quantity: 6 });
      this.scene.time.delayedCall(250, () => e.stop());
    }
  }
}
