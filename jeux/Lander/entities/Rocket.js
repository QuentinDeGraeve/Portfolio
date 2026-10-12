/**
 * Classe représentant la fusée joueur avec système de carburant
 */
export default class Rocket {
constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // Carburant
    this.maxFuel = 100;
    this.fuel = this.maxFuel;
    this.fuelConsumptionRate = 0.5; // Par frame si thruster actif
    this.fuelConsumptionRotationRate = 0.1; // Par frame si thruster actif

    // Créer le sprite de la fusée
    this.sprite = scene.physics.add.image(x, y, 'rocket');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0.5, 0.5);

    // Paramètres de mouvement axial
    this.mainThrusterPower = 300;
    
    // --- INERTIE DE ROTATION ---
    //C'est le bridage de la vitesse de pointe de rotation pour éviter que la fusée ne se transforme en toupie incontrôlable.
    this.maxAngularVelocity = 180;    // Vitesse max de rotation (degrés/sec) 
    
    //C'est la réactivité de tes touches. Plus la valeur est élevée, plus la fusée atteindra vite sa vitesse maximale de rotation. Si tu la baisses (ex: 200), la fusée paraîtra très lourde à pivoter.
    this.angularAcceleration = 600;   // Puissance des rétro-fusées de rotation (degrés/sec²)
    
    //C'est la force du freinage automatique quand tu relâches les flèches. Plus elle est basse (ex: 50), plus le vaisseau continuera de tourner sur lui-même pendant longtemps. Si tu la mets à 0, il tournera indéfiniment à moins de mettre un coup de flèche inverse !
    this.angularDrag = 450;           // Friction/Freinage naturel quand on lâche les touches

    // CORRECTIF : Application correcte sur le body d'Arcade Physics
    this.sprite.body.maxAngularVelocity = this.maxAngularVelocity;
    this.sprite.body.setAngularDrag(this.angularDrag);
    
    this.hasFuel = true;
  }

  /**
   * Appliquer l'accélération du moteur principal (Up)
   */
  applyMainThrust(angleRadians) {
    if (this.fuel <= 0) {
      this.hasFuel = false;
      return;
    }

    this.hasFuel = true;

    // Appliquer la force dans la direction du vaisseau
    const forceX = Math.cos(angleRadians) * this.mainThrusterPower;
    const forceY = Math.sin(angleRadians) * this.mainThrusterPower;

    this.sprite.setAcceleration(forceX, forceY);

    // Consommer du carburant
    this.fuel -= this.fuelConsumptionRate;
    if (this.fuel < 0) this.fuel = 0;
  }

  /**
   * Appliquer la rotation avec inertie
   */
  applyRotation(direction) {
    if (direction === 0) {
      // On coupe l'accélération. C'est le "setAngularDrag" configuré dans le constructor
      // qui va faire glisser et s'éteindre doucement la rotation.
      this.sprite.setAngularAcceleration(0);
    } else {

      if (this.fuel <= 0) {
        this.hasFuel = false;
        return;
      }

      this.hasFuel = true;

      // direction: -1 (gauche) ou 1 (droite)
      // On applique une force de rotation progressive
      const acceleration = direction * this.angularAcceleration;
      this.sprite.setAngularAcceleration(acceleration);
          // Consommer du carburant
          this.fuel -= this.fuelConsumptionRotationRate;
          if (this.fuel < 0) this.fuel = 0;
    }
  }

  /**
   * Ajouter du carburant
   */
  addFuel(amount) {
    this.fuel = Math.min(this.fuel + amount, this.maxFuel);
  }

  /**
   * Obtenir le pourcentage de carburant
   */
  getFuelPercent() {
    return (this.fuel / this.maxFuel) * 100;
  }

  /**
   * Obtenir la position
   */
  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  /**
   * Réinitialiser la fusée
   */
reset(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.setVelocity(0, 0);
    this.sprite.setAcceleration(0, 0);
    this.sprite.setAngularVelocity(0);
    this.sprite.setAngularAcceleration(0); // On remet bien l'accélération à zéro
    this.sprite.setRotation(0);
    this.fuel = this.maxFuel;
    this.hasFuel = true;
  }

  /**
   * Détruire la fusée
   */
  destroy() {
    this.sprite.destroy();
  }
}