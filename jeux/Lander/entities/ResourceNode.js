export default class ResourceNode {
  constructor(scene, x, y, size = 20, color = 0xFFD700, collectedColor = 0x00ff00) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.collectedColor = collectedColor;
    this.collected = false;

    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(this.color, 1);
    this.graphics.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  collect() {
    if (this.collected) return;
    this.collected = true;
    this.graphics.clear();
    this.graphics.fillStyle(this.collectedColor, 1);
    this.graphics.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  destroy() {
    this.graphics.destroy();
  }
}