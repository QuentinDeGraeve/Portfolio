/**
 * Classe représentant un pick-up de carburant flottant dans l'espace
 */
export default class FuelPickup {
  constructor(scene, x, y, fuelAmount = 30) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.fuelAmount = fuelAmount;
    this.collected = false;

    // Créer un sprite pour le pick-up
    this.sprite = scene.add.image(x, y, 'fuel_pickup');
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.body.setVelocity(0, 0);

    // Animation d'oscillation
    this.bobbing = 0;
    this.bobbingSpeed = 0.05;
    this.bobbingAmount = 15;
  }

  /**
   * Mettre à jour l'animation du pick-up
   */
  update() {
    if (this.collected) return;

    // Oscillation vertical
    this.bobbing += this.bobbingSpeed;
    this.sprite.y = this.y + Math.sin(this.bobbing) * this.bobbingAmount;

    // Rotation lente
    this.sprite.rotation += 0.01;
  }

  /**
   * Collecter le pick-up
   */
  collect() {
    if (this.collected) return;
    this.collected = true;
    this.sprite.destroy();
    return this.fuelAmount;
  }

  /**
   * Détruire le pick-up
   */
  destroy() {
    this.sprite.destroy();
  }
}
