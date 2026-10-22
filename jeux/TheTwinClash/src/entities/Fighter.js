export default class Fighter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.health = 100;
    this.maxHealth = 100;
    this.speed = 220;
    this.attackRange = 85;
    this.isAlive = true;
    this.damageScale = 1;      // multiplicateur des dégâts infligés (mode histoire)
    this.damageTakenScale = 1; // multiplicateur des dégâts reçus (mode histoire)
    this.state = 'idle'; // idle, run, attack, kick, stun, dash, special, jump, crouch
    this.stateTimer = 0;
    this.facing = 'right';
    this.isJumping = false;
    this.isInvincible = false;
    this.knockbackTween = null;
    this.animPrefix = 'adele';

    // Boîte de collision / Hurtbox adaptée par défaut aux sprites 256x256
    if (this.body && (texture === 'adele_fighter' || texture === 'heloise_fighter')) {
      this.body.setSize(75, 170);
      this.body.setOffset(90, 80);
    }
  }

  setState(state, duration = 0) {
    this.state = state;
    this.stateTimer = duration > 0 ? this.scene.time.now + duration : 0;
  }

  updateState() {
    if (this.stateTimer && this.scene.time.now > this.stateTimer) {
      // return to idle if timer expired and still alive
      if (this.isAlive && !this.isJumping) {
        this.setState('idle');
      }
      this.stateTimer = 0;
    }
  }

  // Hitbox précise : vérifie l'orientation facing, la portée horizontale et verticale
  isInHitbox(target, reachX = 90, reachY = 80) {
    if (!target || !target.isAlive) return false;

    // Vérifier l'orientation de l'attaque
    const isFacingTarget = this.facing === 'right' ? (target.x >= this.x - 25) : (target.x <= this.x + 25);
    if (!isFacingTarget) return false;

    // Portée horizontale et verticale (permet aux sauts d'éviter les coups au sol)
    const dx = Math.abs(this.x - target.x);
    const dy = Math.abs(this.y - target.y);

    return dx <= reachX && dy <= reachY;
  }

  isInRange(target) {
    return this.isInHitbox(target, this.attackRange, 80);
  }

  takeDamage(amount, stun = false, knockback = 0, fromX = null, isHeavy = false) {
    if (!this.isAlive) return false;

    // Esquive pendant le dash (i-frames) ou si invincible
    if (this.isInvincible || this.state === 'dash') {
      this.showDodgeText();
      return false;
    }

    const finalDamage = Math.max(1, Math.round(amount * this.damageTakenScale));
    this.health = Math.max(0, this.health - finalDamage);

    // Stun / Hit recovery
    const stunDuration = typeof stun === 'number' ? stun : (stun ? (isHeavy ? 450 : 250) : 0);
    if (stunDuration > 0) {
      this.setState('stun', stunDuration);
      const hurtKey = this.scene.anims.exists(`${this.animPrefix}_hurt_block`)
        ? `${this.animPrefix}_hurt_block`
        : `${this.animPrefix}_hurt`;
      if (this.scene.anims.exists(hurtKey)) {
        this.play(hurtKey, true);
      }
    }

    // Effet visuel de flash et affichage des dégâts
    this.flashDamage(isHeavy ? 0xff3333 : 0xffffff, 120);
    this.showDamageText(finalDamage, isHeavy);

    // Knockback physique
    if (knockback > 0) {
      this.applyKnockback(knockback, fromX, isHeavy ? 280 : 180);
    }

    // Son d'impact
    if (isHeavy && this.scene.sound) {
      if (this.scene.sound.get('explodeSound') || this.scene.cache.audio.exists('explodeSound')) {
        this.scene.sound.play('explodeSound', { volume: 0.5 });
      }
    }

    if (this.health <= 0) {
      this.die();
    }

    return true;
  }

  applyKnockback(force, fromX = null, duration = 200) {
    if (this.knockbackTween) {
      this.knockbackTween.stop();
      this.knockbackTween = null;
    }

    let dir = 1;
    if (fromX !== null) {
      dir = this.x >= fromX ? 1 : -1;
    } else {
      dir = this.facing === 'right' ? -1 : 1;
    }

    const targetX = Phaser.Math.Clamp(this.x + dir * force, 60, this.scene.scale.width - 60);

    this.knockbackTween = this.scene.tweens.add({
      targets: this,
      x: targetX,
      duration: duration,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.knockbackTween = null;
      }
    });
  }

  flashDamage(color = 0xffffff, duration = 120) {
    this.setTint(color);
    this.scene.time.delayedCall(duration, () => {
      if (this.isAlive) {
        this.clearTint();
      }
    });
  }

  showDamageText(amount, isHeavy = false) {
    const color = isHeavy ? '#ff3838' : '#ffffff';
    const stroke = isHeavy ? '#000000' : '#222222';
    const text = isHeavy ? `-${amount} !` : `-${amount}`;
    const txt = this.scene.add.text(this.x + Phaser.Math.Between(-15, 15), this.y - 60, text, {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: isHeavy ? '26px' : '20px',
      color: color,
      stroke: stroke,
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(100);

    this.scene.tweens.add({
      targets: txt,
      y: txt.y - 45,
      alpha: 0,
      scale: isHeavy ? 1.3 : 1.1,
      duration: 650,
      ease: 'Power1',
      onComplete: () => txt.destroy()
    });
  }

  showDodgeText() {
    const txt = this.scene.add.text(this.x, this.y - 50, 'ESQUIVE !', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '20px',
      color: '#4cd137',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(100);

    this.scene.tweens.add({
      targets: txt,
      y: txt.y - 35,
      alpha: 0,
      duration: 500,
      onComplete: () => txt.destroy()
    });
  }

  die() {
    this.isAlive = false;
    this.setVelocity(0);
    this.setState('dead');
    if (this.knockbackTween) {
      this.knockbackTween.stop();
      this.knockbackTween = null;
    }
    const key = this.texture ? this.texture.key : '';
    if (this.animPrefix === 'pere' || key.includes('pere')) {
      this.play('boss_death');
    } else if (this.animPrefix === 'adele' || key.includes('adele')) {
      this.play('player_death');
    } else {
      this.play('bot_death');
    }
    this.setTint(0x666666);
  }
}
