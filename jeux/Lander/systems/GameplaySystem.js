import GravityZone from '../entities/GravityZone.js';
import FuelPickup from '../entities/FuelPickup.js';
import CollisionSystem from '../systems/CollisionSystem.js';
import ResourceNode from '../entities/ResourceNode.js';
import MobileUI from '../ui/MobileUI.js';

export default class GameplaySystem {
  constructor(scene, rocket, config = {}) {
    this.scene = scene;
    this.rocket = rocket;
    this.levelOver = false;

    this.gravityZones = (config.gravityZones || []).map(zone => new GravityZone(
      scene, zone.x, zone.y, zone.radius, zone.strength
    ));

    this.fuelPickups = (config.fuelPickups || []).map(pickup => new FuelPickup(
      scene,
      pickup.x,
      pickup.y,
      pickup.amount
    ));

    this.mobileUI = new MobileUI(this.scene);

    this.resources = (config.resources || []).map(resource => new ResourceNode(
      scene,
      resource.x,
      resource.y,
      resource.size,
      resource.color,
      resource.collectedColor
    ));

    this.onLevelEnd = config.onLevelEnd || (() => {});
    this.onCrash = config.onCrash || (() => {});

    this.collisionSystem = new CollisionSystem(scene, rocket, config, {
      onCrash: message => this.handleCrash(message),
      onLevelEnd: (success, message) => this.handleLevelEnd(success, message),
      isResourceCollected: () => this.isResourceCollected()
    });
  }

  update(keys) {
    if (this.levelOver) return;

    const body = this.rocket.sprite.body;
    const inGravity = this.applyGravityZones(body);
    if (!inGravity) {
      this.rocket.sprite.setAcceleration(0, 0);
    }

    this.handleControls(keys);
    this.updateFuelPickups();
    this.updateResources();
    this.collisionSystem.update();

    
  }

  applyGravityZones(body) {
    let inZone = false;
    this.gravityZones.forEach(zone => {
      const inside = zone.applyGravity(body);
      if (inside) {
        inZone = true;
      }
    });
    return inZone;
  }

  // Méthode pour injecter l'interface mobile quand elle est créée
  setMobileUI(mobileUI) {
    this.mobileUI = mobileUI;
  }

  handleControls(keys) {
      const currentRotation = this.rocket.sprite.rotation;
      const angleRadians = currentRotation - Math.PI / 2;

      // Calcul de l'état final des contrôles (Clavier OU Mobile)
      const isLeftPressed = keys.left.isDown || (this.mobileUI && this.mobileUI.pressed.left);
      const isRightPressed = keys.right.isDown || (this.mobileUI && this.mobileUI.pressed.right);
      const isUpPressed = keys.up.isDown || (this.mobileUI && this.mobileUI.pressed.thrust);

      // Gestion de la rotation
      if (isLeftPressed) {
        this.rocket.applyRotation(-1);
      } else if (isRightPressed) {
        this.rocket.applyRotation(1);
      } else {
        this.rocket.applyRotation(0);
      }

      // Gestion de la poussée
      if (isUpPressed && this.rocket.fuel > 0) {
        this.rocket.applyMainThrust(angleRadians);
      }
  }

  updateFuelPickups() {
    this.fuelPickups.forEach(pickup => {
      if (!pickup.collected) {
        const dist = Phaser.Math.Distance.Between(
          this.rocket.sprite.x, this.rocket.sprite.y,
          pickup.sprite.x, pickup.sprite.y
        );

        if (dist < 30) {
          const fuelGained = pickup.collect();
          this.rocket.addFuel(fuelGained);
        }
      }
      pickup.update();
    });
  }

  updateResources() {
    this.resources.forEach(resource => {
      if (!resource.collected) {
        const dist = Phaser.Math.Distance.Between(
          this.rocket.sprite.x, this.rocket.sprite.y,
          resource.x, resource.y
        );

        if (dist < 30) {
          resource.collect();
        }
      }
    });
  }

  handleCrash(message) {
    if (this.levelOver) return;
    this.levelOver = true;
    this.onCrash(message);
  }

  handleLevelEnd(success, message) {
    if (this.levelOver) return;
    this.levelOver = true;
    this.onLevelEnd(success, message);
  }

  isResourceCollected() {
    return this.resources.every(resource => resource.collected);
  }

  destroy() {
    this.collisionSystem.destroy();
    this.gravityZones = [];
    this.fuelPickups.forEach(pickup => pickup.destroy());
    this.resources.forEach(resource => resource.destroy());
    this.resources = [];
    if (this.mobileUI && this.mobileUI.destroy) {
      this.mobileUI.destroy();
    }
  }
}
