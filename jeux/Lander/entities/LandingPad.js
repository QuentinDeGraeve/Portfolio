/**
 * Classe représentant une zone d'atterrissage
 */
export default class LandingPad {
  constructor(scene, x, y, width = 100, height = 20) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Créer le visuel du pad
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0x00ff00, 1);
    this.graphics.fillRect(x - width / 2, y - height / 2, width, height);

    // Ajouter une hitbox physique
    this.body = scene.physics.add.staticImage(x, y, null);
    this.body.body.setSize(width, height);
    this.body.setVisible(false);
  }

  /**
   * Détruire le pad
   */
  destroy() {
    this.graphics.destroy();
    this.body.destroy();
  }
}
