export default class MobileUI {
  constructor(scene) {
    this.scene = scene;
    this.buttons = {};
    this.pressed = { left: false, right: false, thrust: false };

    this._onGlobalPointerUp = this.resetPresses.bind(this);
    this._onResize = this.positionButtons.bind(this);

    this.createControls();

    // Keep UI responsive and on top
    this.scene.scale.on('resize', this._onResize);
    this.scene.input.on('pointerup', this._onGlobalPointerUp);
  }

  createControls() {
    const { width, height } = this.scene.scale;
    const size = Math.max(40, Math.floor(Math.min(width, height) * 0.08));

    // Création d'un bouton helper
    const createBtn = (x, y, color, label) => {
      const btn = this.scene.add.circle(x, y, size, color, 0.5).setInteractive();
      btn.setScrollFactor(0);
      btn.setDepth(1000);

      btn.on('pointerdown', () => this.pressed[label] = true);
      btn.on('pointerup', () => this.pressed[label] = false);
      btn.on('pointerupoutside', () => this.pressed[label] = false);
      btn.on('pointerout', () => this.pressed[label] = false);
      btn.on('pointercancel', () => this.pressed[label] = false);

      return btn;
    };

    // Positionnement des boutons en bas de l'écran (relative)
    const margin = Math.max(20, Math.floor(size * 0.5));
    this.buttons.left = createBtn(margin + size, height - margin - size, 0xff0000, 'left');
    this.buttons.right = createBtn(margin + size * 3, height - margin - size, 0x00ff00, 'right');
    this.buttons.thrust = createBtn(width - margin - size, height - margin - size, 0x0000ff, 'thrust');
  }

  positionButtons() {
    if (!this.scene || !this.buttons) return;
    const { width, height } = this.scene.scale;
    const size = Math.max(40, Math.floor(Math.min(width, height) * 0.08));
    const margin = Math.max(20, Math.floor(size * 0.5));

    if (this.buttons.left) this.buttons.left.setPosition(margin + size, height - margin - size).setRadius(size);
    if (this.buttons.right) this.buttons.right.setPosition(margin + size * 3, height - margin - size).setRadius(size);
    if (this.buttons.thrust) this.buttons.thrust.setPosition(width - margin - size, height - margin - size).setRadius(size);
  }

  resetPresses() {
    Object.keys(this.pressed).forEach(k => this.pressed[k] = false);
  }

  destroy() {
    try {
      this.scene.scale.off('resize', this._onResize);
      this.scene.input.off('pointerup', this._onGlobalPointerUp);
    } catch (e) {}

    Object.values(this.buttons).forEach(b => { if (b && b.destroy) b.destroy(); });
    this.buttons = {};
  }
}