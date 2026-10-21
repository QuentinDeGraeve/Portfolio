import HealthBar from '../ui/HealthBar.js';
import Barks from '../ui/Barks.js';
import TouchControls from '../ui/TouchControls.js';
import { BARKS, STEPS, runStep, stepTarget } from '../story/storyScript.js';
import runCountdown from '../ui/Countdown.js';

// Acte II : shooter en vue du dessus.
// Adèle est contrôlée par le joueur, Héloïse la suit et tire automatiquement.
const WAVES = [
  { count: 8, speed: 70, hp: 2 },
  { count: 12, speed: 85, hp: 2 },
  { count: 16, speed: 95, hp: 3 }
];
const LOW_HEALTH = 0.35;
const ENEMY_ACCEL = 0.02;   // gain de vitesse par seconde écoulée (+2 %/s)
const ENEMY_MAX_BOOST = 3;  // multiplicateur maximal de vitesse
const WORLD_WIDTH = 1700; // largeur du ring en mode Survie (écran = 960 → effet de zoom)
// Zone jouable = intérieur des cordes, en proportion de l'image (gauche, droite, haut, bas)
const RING_ZONE = { l: 0.11, r: 0.89, t: 0.13, b: 0.88 };

export default class ShooterScene extends Phaser.Scene {
  constructor() { super('Shooter'); }

  create(data) {
    // Mode histoire (acte II) : 3 vagues puis dialogue. Sans données : mode Survie (vagues infinies).
    this.story = (data && data.story) || null;
    this.finished = false;
    this.started = false; // passe à true à la fin du compte à rebours
    this.waveIndex = -1;
    this.toSpawn = 0;
    this.waveClearing = false;
    this.warned = { A: false, B: false };
    this.startTime = this.time.now;

    // Taille du monde : grand ring scrollable (même fond pour Histoire et Survie)
    const src = this.textures.get('bgRingHaut').getSourceImage();
    this.worldW = WORLD_WIDTH;
    this.worldH = Math.round(WORLD_WIDTH * src.height / src.width);
    this.add.image(this.worldW / 2, this.worldH / 2, 'bgRingHaut').setDisplaySize(this.worldW, this.worldH);
    this.cameras.main.setBackgroundColor('#10131a');
    // Limites de déplacement : intérieur des cordes pour les deux modes
    this.zone = new Phaser.Geom.Rectangle(
        this.worldW * RING_ZONE.l, this.worldH * RING_ZONE.t,
        this.worldW * (RING_ZONE.r - RING_ZONE.l), this.worldH * (RING_ZONE.b - RING_ZONE.t));
    this.physics.world.setBounds(this.zone.x, this.zone.y, this.zone.width, this.zone.height);

    this.sound.stopAll();
    this.music = this.sound.add('bgmCombat', { loop: true, volume: 0.5 });
    this.music.play();

    // Texture générée (balles)
    this.makeCircleTexture('bullet', 5, 0xfff2a0);

    // Sœurs : placées au centre du ring dans les deux modes
    const sx = this.worldW / 2, sy = this.worldH / 2;
    this.adele = this.makeSister(sx, sy, 'adele_fighter', 'adele_idle');
    // Mode Survie : Adèle seule ; Mode Histoire : Héloïse l'accompagne
    this.heloise = this.story ? this.makeSister(sx - 80, sy + 30, 'heloise_fighter', 'heloise_idle') : null;
    this.sisters = this.heloise ? [this.adele, this.heloise] : [this.adele];

    // Caméra scrollable pour les deux modes
    this.cameras.main.setBounds(0, 0, this.worldW, this.worldH);
    this.cameras.main.startFollow(this.adele, true, 0.1, 0.1);

    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();

    this.physics.add.overlap(this.bullets, this.enemies, (b, e) => this.onBulletHit(b, e));
    // Phaser peut inverser l'ordre des arguments (sprite/groupe) : on les remet dans le bon ordre
    this.sisters.forEach(sis => {
      this.physics.add.overlap(sis, this.enemies, (a, b) => {
        const enemy = a === sis ? b : a;
        this.onEnemyTouch(enemy, sis);
      });
    });

    // Contrôles : flèches / ZQSD, souris pour viser, clic ou ESPACE pour tirer
    this.keys = this.input.keyboard.addKeys({
      up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT',
      z: 'Z', q: 'Q', s: 'S', d: 'D', space: 'SPACE'
    });
    this.lastShot = 0;
    this.lastAllyShot = 0;
    // Mobile : joystick gauche = déplacement, joystick droit = direction du tir (tir continu tant qu'il est tenu)
    this.touch = TouchControls.supported(this) ? new TouchControls(this, [], { aimStick: true }) : null;

    // Interface
    this.add.text(20, 2, 'ADÈLE', { fontSize: '12px', fontStyle: 'bold', color: '#6ec1ff' }).setScrollFactor(0).setDepth(100);
    this.barA = new HealthBar(this, 20, 20, this.adele, 0x46d160);
    if (this.heloise) {
      this.add.text(720, 2, 'HÉLOÏSE', { fontSize: '12px', fontStyle: 'bold', color: '#ff8fd0' }).setScrollFactor(0).setDepth(100);
      this.barB = new HealthBar(this, 720, 20, this.heloise, 0xff8fd0);
    }
    this.waveText = this.add.text(480, 20, '', { fontSize: '22px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);
    this.banner = this.add.text(480, 200, '', { fontSize: '40px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 5 }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setAlpha(0);
    this.barks = new Barks(this);

    runCountdown(this, () => {
      this.started = true;
      this.startTime = this.time.now;
      this.time.delayedCall(600, () => this.startNextWave());
    });
  }

  makeCircleTexture(key, r, color) {
    if (this.textures.exists(key)) return;
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 1).fillCircle(r, r, r);
    g.generateTexture(key, r * 2, r * 2);
    g.destroy();
  }

  makeSister(x, y, texture, idleAnim) {
    const s = this.physics.add.sprite(x, y, texture).setScale(0.45).setDepth(10);
    s.body.setSize(110, 200, true);
    s.setCollideWorldBounds(true);
    s.play(idleAnim);
    s.health = 100; s.maxHealth = 100; s.isAlive = true;
    return s;
  }

  // --- Vagues -------------------------------------------------------------
  startNextWave() {
    if (this.finished) return;
    this.waveIndex++;
    if (this.story && this.waveIndex >= WAVES.length) { this.victory(); return; }
    const wave = this.story ? WAVES[this.waveIndex] : this.survivalWave(this.waveIndex);
    this.toSpawn = wave.count;
    this.waveText.setText(this.story ? `Vague ${this.waveIndex + 1} / ${WAVES.length}` : `Vague ${this.waveIndex + 1}`);
    this.showBanner(`VAGUE ${this.waveIndex + 1}`);
    const lines = this.story && BARKS.act2[this.waveIndex];
    if (lines) this.barks.say(lines);

    this.time.addEvent({
      delay: 700, repeat: wave.count - 1,
      callback: () => { this.spawnEnemy(wave); this.toSpawn--; }
    });
  }

  // Mode Survie : la difficulté augmente à chaque vague
  survivalWave(i) {
    return {
      count: Math.min(8 + i * 3, 40),
      speed: Math.min(70 + i * 8, 170),
      hp: 2 + Math.floor(i / 3)
    };
  }

  showBanner(text) {
    this.tweens.killTweensOf(this.banner);
    this.banner.setText(text).setAlpha(1);
    this.tweens.add({ targets: this.banner, alpha: 0, duration: 1200, delay: 600 });
  }

  spawnEnemy(wave) {
    if (this.finished) return;
    // Les ennemis apparaissent juste en dehors de l'écran visible
    const v = this.cameras.main.worldView;
    const side = Phaser.Math.Between(0, 3);
    let x, y;
    if (side === 0) { x = v.left - 30; y = Phaser.Math.Between(v.top, v.bottom); }
    else if (side === 1) { x = v.right + 30; y = Phaser.Math.Between(v.top, v.bottom); }
    else if (side === 2) { x = Phaser.Math.Between(v.left, v.right); y = v.top - 30; }
    else { x = Phaser.Math.Between(v.left, v.right); y = v.bottom + 30; }

    const e = this.enemies.create(x, y, 'enemie_fighter').setScale(0.8).setDepth(9);
    e.body.setSize(90, 110, true);
    e.play('enemie_walk');
    e.hp = wave.hp;
    e.speed = wave.speed * Phaser.Math.FloatBetween(0.85, 1.2);
    e.nextHit = 0;
  }

  // --- Boucle -------------------------------------------------------------
  update(time) {
    if (this.finished || !this.started) return;

    this.barA.update();
    if (this.barB) this.barB.update();

    this.updateAdele(time);
    if (this.heloise) this.updateHeloise(time);
    this.updateEnemies();
    this.cleanBullets();
    this.checkHealthWarnings();

    if (this.sisters.some(s => !s.isAlive)) { this.defeat(); return; }

    // Fin de vague
    if (this.waveIndex >= 0 && (!this.story || this.waveIndex < WAVES.length) && this.toSpawn <= 0
        && this.enemies.countActive(true) === 0 && !this.waveClearing) {
      this.waveClearing = true;
      this.time.delayedCall(1800, () => { this.waveClearing = false; this.startNextWave(); });
    }
  }

  updateAdele(time) {
    const k = this.keys, a = this.adele;
    let vx = 0, vy = 0;
    if (k.left.isDown || k.q.isDown) vx -= 1;
    if (k.right.isDown || k.d.isDown) vx += 1;
    if (k.up.isDown || k.z.isDown) vy -= 1;
    if (k.down.isDown || k.s.isDown) vy += 1;
    const t = this.touch;
    if (t && (t.vx || t.vy)) {
      // Joystick : vitesse proportionnelle à l'inclinaison
      a.setVelocity(t.vx * 200, t.vy * 200);
    } else {
      const v = new Phaser.Math.Vector2(vx, vy).normalize().scale(200);
      a.setVelocity(v.x, v.y);
    }

    if (t) {
      const aim = t.aim;
      if (aim.vx || aim.vy) {
        // Joystick de visée tenu : tir régulier dans cette direction
        a.setFlipX(aim.vx < 0);
        if (time - this.lastShot > 220) {
          this.lastShot = time;
          this.shoot(a, a.x + aim.vx * 100, a.y + aim.vy * 100);
        }
      } else if (t.vx) {
        a.setFlipX(t.vx < 0);
      }
      return;
    }

    const p = this.input.activePointer;
    a.setFlipX(p.worldX < a.x);

    if ((p.isDown || k.space.isDown) && time - this.lastShot > 220) {
      this.lastShot = time;
      this.shoot(a, p.worldX, p.worldY);
    }
  }

  updateHeloise(time) {
    const h = this.heloise, a = this.adele;
    // Reste près d'Adèle
    const dx = a.x - h.x, dy = a.y - h.y;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist > 110) h.setVelocity((dx / dist) * 190, (dy / dist) * 190);
    else if (dist < 60) h.setVelocity((-dx / dist) * 120, (-dy / dist) * 120);
    else h.setVelocity(0, 0);

    // Tire sur l'ennemi le plus proche
    const target = this.nearestEnemy(h, 420);
    if (target) {
      h.setFlipX(target.x < h.x);
      if (time - this.lastAllyShot > 500) {
        this.lastAllyShot = time;
        this.shoot(h, target.x, target.y);
      }
    }
  }

  nearestEnemy(from, maxDist) {
    let best = null, bestD = maxDist;
    this.enemies.children.iterate(e => {
      if (!e || !e.active) return;
      const d = Phaser.Math.Distance.Between(from.x, from.y, e.x, e.y);
      if (d < bestD) { bestD = d; best = e; }
    });
    return best;
  }

  updateEnemies() {
    // Les ennemis accélèrent progressivement avec le temps (plafonné)
    const boost = Math.min(1 + ((this.time.now - this.startTime) / 1000) * ENEMY_ACCEL, ENEMY_MAX_BOOST);
    const alive = this.sisters.filter(s => s.isAlive);
    this.enemies.children.iterate(e => {
      if (!e || !e.active) return;
      if (!alive.length) { e.setVelocity(0, 0); return; }
      const t = alive.reduce((p, c) =>
        Phaser.Math.Distance.Between(e.x, e.y, p.x, p.y) <= Phaser.Math.Distance.Between(e.x, e.y, c.x, c.y) ? p : c);
      this.physics.moveToObject(e, t, e.speed * boost);
      e.setFlipX(t.x < e.x);
    });
  }

  shoot(from, tx, ty) {
    const ang = Phaser.Math.Angle.Between(from.x, from.y, tx, ty);
    const b = this.bullets.create(from.x + Math.cos(ang) * 30, from.y + Math.sin(ang) * 30, 'bullet').setDepth(11);
    b.setVelocity(Math.cos(ang) * 520, Math.sin(ang) * 520);
    this.sound.play('punch', { volume: 0.25 });
  }

  cleanBullets() {
    const z = this.zone;
    this.bullets.children.iterate(b => {
      if (b && b.active && (b.x < z.left - 20 || b.x > z.right + 20 || b.y < z.top - 20 || b.y > z.bottom + 20)) b.destroy();
    });
  }

  onBulletHit(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;
    bullet.destroy();
    enemy.hp--;
    enemy.setTintFill(0xffffff);
    this.time.delayedCall(60, () => { if (enemy.active) enemy.clearTint(); });
    if (enemy.hp <= 0) {
      this.sound.play('hit', { volume: 0.4 });
      enemy.destroy();
    }
  }

  // Petite explosion (cercle qui s'étend + éclats) à la position donnée
  explode(x, y) {
    const ring = this.add.circle(x, y, 10, 0xff8c1a, 0.9).setDepth(12);
    this.tweens.add({ targets: ring, scale: 4, alpha: 0, duration: 350, onComplete: () => ring.destroy() });
    for (let i = 0; i < 10; i++) {
      const ang = (Math.PI * 2 * i) / 10 + Phaser.Math.FloatBetween(-0.2, 0.2);
      const dist = Phaser.Math.Between(30, 70);
      const p = this.add.circle(x, y, Phaser.Math.Between(3, 6), i % 2 ? 0xffd34d : 0xff4d1a).setDepth(12);
      this.tweens.add({
        targets: p, x: x + Math.cos(ang) * dist, y: y + Math.sin(ang) * dist,
        alpha: 0, duration: 400, onComplete: () => p.destroy()
      });
    }
    this.playExplosionSound();
  }

  // Bruit d'explosion synthétisé (bruit blanc filtré + grondement grave)
  playExplosionSound() {
    const ctx = this.sound.context;
    if (!ctx) { this.sound.play('hit', { volume: 0.5 }); return; }
    const t = ctx.currentTime, dur = 0.6;

    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, t);
    filter.frequency.exponentialRampToValueAtTime(150, t + dur);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.7, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + dur);
    const oGain = ctx.createGain();
    oGain.gain.setValueAtTime(0.8, t);
    oGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(oGain);
    oGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  onEnemyTouch(enemy, sister) {
    const now = this.time.now;
    if (!enemy.active || !sister.isAlive || now < enemy.nextHit) return;
    enemy.nextHit = now + 800;
    // L'ennemi explose au contact et fait perdre 1/4 de vie
    this.explode(enemy.x, enemy.y);
    enemy.destroy();
    sister.health = Math.max(0, sister.health - sister.maxHealth / 4);
    sister.setTintFill(0xff4444);
    this.time.delayedCall(100, () => { if (sister.active && sister.isAlive) sister.clearTint(); });
    this.cameras.main.shake(80, 0.004);
    if (sister.health <= 0) { sister.isAlive = false; sister.setTint(0x666666); sister.setVelocity(0, 0); }
  }

  checkHealthWarnings() {
    if (!this.story) return;
    if (!this.warned.B && this.heloise.isAlive && this.heloise.health / this.heloise.maxHealth < LOW_HEALTH) {
      this.warned.B = true;
      this.barks.say(BARKS.act2LowB);
    } else if (!this.warned.A && this.adele.isAlive && this.adele.health / this.adele.maxHealth < LOW_HEALTH) {
      this.warned.A = true;
      this.barks.say(BARKS.act2LowA);
    }
  }

  // --- Fin ----------------------------------------------------------------
  victory() {
    this.finished = true;
    this.sisters.forEach(s => s.setVelocity(0, 0));
    this.enemies.clear(true, true);
    this.showBanner('VICTOIRE');
    this.time.delayedCall(2200, () => {
      this.sound.stopAll();
      runStep(this, STEPS[this.story.step].next);
    });
  }

  defeat() {
    this.finished = true;
    this.sound.stopAll();
    this.time.delayedCall(400, () => {
      this.scene.start('GameOver', {
        retry: this.story ? stepTarget(this.story.step) : { scene: 'Shooter', data: {} },
        wave: this.story ? null : this.waveIndex + 1
      });
    });
  }
}
