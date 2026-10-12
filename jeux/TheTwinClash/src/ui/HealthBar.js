export default class HealthBar {
  constructor(scene, x, y, owner, color=0xff4444) {
    this.scene = scene;
    this.owner = owner;
    this.x = x; this.y = y;
    this.bg = scene.add.rectangle(x, y, 220, 18, 0x222222).setOrigin(0,0).setScrollFactor(0);
    this.bar = scene.add.rectangle(x+2, y+2, 216, 14, color).setOrigin(0,0).setScrollFactor(0);
    this.border = scene.add.rectangle(x-2, y-2, 224, 22).setStrokeStyle(2, 0x000000).setOrigin(0,0).setScrollFactor(0);
  }
  update() {
    const pct = Phaser.Math.Clamp(this.owner.health / this.owner.maxHealth, 0, 1);
    this.bar.width = Math.round(216 * pct);
  }
}
