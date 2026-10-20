// Contrôles tactiles : joystick virtuel flottant (gauche) + boutons d'action + joystick de visée optionnel (droite).
// Créé uniquement sur appareil tactile (ou avec ?touch dans l'URL pour tester sur ordinateur).
const DEPTH = 90;
const STICK_RADIUS = 60;
const DEAD_ZONE = 0.2;
const STICK_ZONE = 0.45; // chaque joystick se déclenche dans les 45 % de son côté de l'écran

// Joystick flottant : apparaît sous le doigt, dans la zone [minX, maxX]
class Stick {
  constructor(scene, home, minX, maxX, color) {
    this.scene = scene; this.home = home; this.minX = minX; this.maxX = maxX;
    this.vx = 0; this.vy = 0; // direction de -1 à 1 (0 dans la zone morte)
    this.active = false;      // doigt posé sur le stick
    this.pointerId = null;
    this.center = { x: home.x, y: home.y };
    this.base = scene.add.circle(home.x, home.y, STICK_RADIUS, color, 0.1)
      .setStrokeStyle(3, color, 0.5).setScrollFactor(0).setDepth(DEPTH);
    this.knob = scene.add.circle(home.x, home.y, 26, color, 0.35).setScrollFactor(0).setDepth(DEPTH);
    this.color = color;
  }

  owns(pointer) { return pointer.id === this.pointerId; }

  down(pointer) {
    if (this.pointerId !== null || pointer.x < this.minX || pointer.x > this.maxX) return false;
    this.pointerId = pointer.id;
    this.active = true;
    const r = STICK_RADIUS + 10, h = this.scene.scale.height;
    this.center.x = Phaser.Math.Clamp(pointer.x, this.minX + r, this.maxX - r);
    this.center.y = Phaser.Math.Clamp(pointer.y, h * 0.3, h - r);
    this.base.setPosition(this.center.x, this.center.y).setFillStyle(this.color, 0.2);
    this.move(pointer);
    return true;
  }

  move(pointer) {
    let dx = pointer.x - this.center.x, dy = pointer.y - this.center.y;
    const len = Math.hypot(dx, dy);
    if (len > STICK_RADIUS) { dx = dx / len * STICK_RADIUS; dy = dy / len * STICK_RADIUS; }
    this.knob.setPosition(this.center.x + dx, this.center.y + dy);
    if (Math.hypot(dx, dy) / STICK_RADIUS < DEAD_ZONE) { this.vx = 0; this.vy = 0; }
    else { this.vx = dx / STICK_RADIUS; this.vy = dy / STICK_RADIUS; }
  }

  up() {
    this.pointerId = null; this.active = false;
    this.vx = 0; this.vy = 0;
    this.center.x = this.home.x; this.center.y = this.home.y;
    this.base.setPosition(this.home.x, this.home.y).setFillStyle(this.color, 0.1);
    this.knob.setPosition(this.home.x, this.home.y);
  }
}

export default class TouchControls {
  static supported(scene) {
    return !!scene.sys.game.device.input.touch || new URLSearchParams(window.location.search).has('touch');
  }

  // buttons : [{ key, label, x, y, r, color }] ; options.aimStick : ajoute un joystick de visée à droite
  constructor(scene, buttons = [], options = {}) {
    this.scene = scene;
    this.buttons = {};

    const w = scene.scale.width, h = scene.scale.height;
    const zoneW = w * STICK_ZONE;
    this.move = new Stick(scene, { x: 120, y: h - 120 }, 0, zoneW, 0xffffff);
    this.aim = options.aimStick ? new Stick(scene, { x: w - 120, y: h - 120 }, w - zoneW, w, 0xff6b6b) : null;
    this.sticks = this.aim ? [this.move, this.aim] : [this.move];

    // Multi-touch : deux joysticks + boutons en même temps
    if (!scene.input.pointer3) scene.input.addPointer(3);

    scene.input.on('pointerdown', p => { for (const s of this.sticks) if (s.down(p)) break; });
    scene.input.on('pointermove', p => this.sticks.forEach(s => { if (s.owns(p)) s.move(p); }));
    const release = p => this.sticks.forEach(s => { if (s.owns(p)) s.up(); });
    scene.input.on('pointerup', release);
    scene.input.on('pointerupoutside', release);

    buttons.forEach(b => this.addButton(b));
  }

  // Joystick de déplacement
  get vx() { return this.move.vx; }
  get vy() { return this.move.vy; }
  get left() { return this.vx < -0.35; }
  get right() { return this.vx > 0.35; }
  get up() { return this.vy < -0.6; }
  get down() { return this.vy > 0.6; }

  isDown(key) { const b = this.buttons[key]; return !!b && b.down; }

  // Vrai une seule fois par appui (équivalent de Keyboard.JustDown)
  justDown(key) {
    const b = this.buttons[key];
    if (!b || !b.pressed) return false;
    b.pressed = false;
    return true;
  }

  addButton({ key, label, x, y, r, color = 0xffffff }) {
    const st = { down: false, pressed: false };
    this.buttons[key] = st;
    const circle = this.scene.add.circle(x, y, r, color, 0.3)
      .setStrokeStyle(3, 0xffffff, 0.6).setScrollFactor(0).setDepth(DEPTH)
      .setInteractive(new Phaser.Geom.Circle(r, r, r), Phaser.Geom.Circle.Contains);
    this.scene.add.text(x, y, label, {
      fontSize: `${Math.round(r * 0.4)}px`, fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(DEPTH);

    const release = () => { st.down = false; circle.setFillStyle(color, 0.3); };
    circle.on('pointerdown', () => { st.down = true; st.pressed = true; circle.setFillStyle(color, 0.65); });
    circle.on('pointerup', release);
    circle.on('pointerout', release);
  }
}
