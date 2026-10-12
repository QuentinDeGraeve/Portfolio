/**
 * Classe représentant une zone de gravité autour d'une planète
 */
export default class GravityZone {
  constructor(scene, x, y, radius, strength) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.strength = strength;
    
    // Appel de la méthode de dessin
    this.drawLimite();
  }

  /**
   * Dessine la limite de la zone de gravité
   */
  drawLimite() {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(1, 0x00ffff, 0.3);
    graphics.strokeCircle(this.x, this.y, this.radius);
  }

  /**
   * Applique la gravité à un objet physique
   */
  applyGravity(body) {
    const dx = this.x - body.x;
    const dy = this.y - body.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.radius) {
      const forceX = (dx / distance) * this.strength;
      const forceY = (dy / distance) * this.strength;

      if (body.isLandingInProgress) {
        body.setAcceleration(0, forceY);
        return true;
      }

      body.setAcceleration(forceX, forceY);
      return true;
    } else {
      return false;
    }
  }

  isInZone(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius;
  }
}