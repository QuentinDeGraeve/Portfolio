import LandingPad from '../entities/LandingPad.js';

export default class CollisionSystem {
  constructor(scene, rocket, config = {}, callbacks = {}) {
    this.scene = scene;
    this.rocket = rocket;
    this.planetSurfaces = config.planetSurfaces || [];
    this.screenBounds = config.screenBounds || { minX: 0, maxX: 800, minY: 0, maxY: 600 };
    this.onLevelEnd = callbacks.onLevelEnd || (() => {});
    this.onCrash = callbacks.onCrash || (() => {});
    this.isResourceCollected = callbacks.isResourceCollected || (() => true);
    
    this.levelOver = false;
    this.canDetectLanding = false;
    this.landingDelay = config.landingDelay ?? 2000;

    // Variables de suivi pour l'alunissage progressif
    this.isLandingInProgress = false;
    this.stableStartTime = 0; // Enregistre le moment précis où la fusée s'est stabilisée au sol
    this.fuelRefillTimer = null;
    this.lastValidPadConfig = null;

    // Variables de secours pour analyser la vitesse exacte au moment de l'impact
    this.lastVelocityX = 0;
    this.lastVelocityY = 0;

    this.landingPads = this.createLandingPads(config.landingPads || []);
    this.drawPlanetSurfaces();

    this.scene.time.delayedCall(this.landingDelay, () => {
      this.canDetectLanding = true;
    });
  }

  createLandingPads(padConfigs) {
    return padConfigs.map(padConfig => {
      const pad = new LandingPad(
        this.scene,
        padConfig.x,
        padConfig.y,
        padConfig.width,
        padConfig.height
      );

      pad.body.setData('padConfig', padConfig);
      this.scene.physics.add.collider(this.rocket.sprite, pad.body, this.handlePadCollision, null, this);
      return pad;
    });
  }

  drawPlanetSurfaces() {
    this.planetSurfaces.forEach(surface => {
      if (surface.color != null) {
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(surface.color, surface.alpha ?? 0.8);
        graphics.fillCircle(surface.x, surface.y, surface.radius);
      }
    });
  }

  update() {
    if (this.levelOver) return;

    // Enregistrement continu des vitesses de la frame en cours (sécurité anti-calcul instantané du rebond)
    if (this.rocket && this.rocket.sprite && this.rocket.sprite.body) {
      this.lastVelocityX = this.rocket.sprite.body.velocity.x;
      this.lastVelocityY = this.rocket.sprite.body.velocity.y;
    }

    this.checkWorldCollision();
    this.checkPlanetSurfaces();
    this.checkLandingStatus();
  }

  checkWorldCollision() {
    const body = this.rocket.sprite.body;
    const x = this.rocket.sprite.x;
    const y = this.rocket.sprite.y;
    const radius = Math.max(body.halfWidth || 20, body.halfHeight || 20);

    if (x - radius <= this.screenBounds.minX || x + radius >= this.screenBounds.maxX ||
        y - radius <= this.screenBounds.minY || y + radius >= this.screenBounds.maxY) {
      this.handleCrash('Crashed into screen boundary!');
    }
  }

  checkPlanetSurfaces() {
    const x = this.rocket.sprite.x;
    const y = this.rocket.sprite.y;
    const body = this.rocket.sprite.body;
    const radius = Math.max(body.halfWidth || 20, body.halfHeight || 20);

    this.planetSurfaces.forEach(surface => {
      const distance = Phaser.Math.Distance.Between(x, y, surface.x, surface.y);
      if (distance < surface.radius + radius) {
        this.handleCrash(surface.crashMessage || 'Crashed into planet!');
      }
    });
  }

  /**
   * CORRECTIF : Gestion de la stabilisation et réinitialisation intelligente du chrono
   */
  checkLandingStatus() {
    if (!this.isLandingInProgress) return;

    const body = this.rocket.sprite.body;
    const touchingPad = body.touching.down || body.blocked.down;

    // 1. Détection d'un VRAI décollage volontaire (si le joueur remet les gaz à fond vers le haut)
    if (body.velocity.y < -60) {
      this.cancelLandingTimers();
      console.log("Décollage volontaire détecté ! Retour en vol libre.");
      return;
    }

    // 2. Gestion du compte à rebours de victoire
    if (touchingPad && Math.abs(body.velocity.y) < 5) {
      // Si la fusée est immobile et posée sur le pad
      if (this.stableStartTime === 0) {
        this.stableStartTime = this.scene.time.now; // On commence à compter le temps stable
        console.log("Fusée stabilisée. Début du décompte des 3 secondes...");
      } else {
        // Si elle est restée stable pendant 3000ms (3 secondes)
        const elapsed = this.scene.time.now - this.stableStartTime;
        if (elapsed >= 3000) {
          if (this.isResourceCollected()) {
            this.levelOver = true;
            const successMsg = this.lastValidPadConfig?.successMessage || 'Landing successful !';
            this.cancelLandingTimers();
            this.onLevelEnd(true, successMsg);
          } else {
            console.log(this.lastValidPadConfig?.resourceMissingMessage || "Plateforme : Il vous manque les ressources nécessaires !");
            this.stableStartTime = 0; // Reset pour éviter les spams de logs, mais reste en mode atterrissage
          }
        }
      }
    } else {
      // Si la fusée décolle légèrement à cause du rebond (touchingPad devient false ou vitesse instable)
      // On remet le chrono à zéro, mais on ne quitte PAS le mode atterrissage (le DragX reste actif)
      if (this.stableStartTime !== 0) {
        this.stableStartTime = 0;
        console.log("Fusée instable ou en plein rebond... Chrono réinitialisé.");
      }
    }
  }

  handlePadCollision(rocketSprite, padBody) {
    if (this.levelOver || !this.canDetectLanding) return;
    if (this.isLandingInProgress) return;

    const padConfig = padBody.getData('padConfig');
    if (!padConfig) return;

    // Utilisation de nos variables de secours pour analyser l'impact réel précédant la réaction du ressort physique (Bounce)
    const vitesseVerticale = this.lastVelocityY;
    const vitesseHorizontale = this.lastVelocityX;
    const angleVaisseau = Math.abs(rocketSprite.angle); 

    const maxVitesseChute = padConfig.maxVerticalSpeed || 80;       
    const maxVitesseHoriz = padConfig.maxHorizontalSpeed || 80;       
    const maxAngleTolerance = padConfig.maxAngle || 30; // 30° acceptés

    const vitesseOk = (vitesseVerticale <= maxVitesseChute) && (Math.abs(vitesseHorizontale) <= maxVitesseHoriz);
    const angleOk = angleVaisseau <= maxAngleTolerance;

    if (!vitesseOk || !angleOk) {
      let messageErreur = padConfig.failMessage || "💥 CRASH ! ";
      if (!vitesseOk) messageErreur += "Vitesse trop élevée ! ";
      if (!angleOk) messageErreur += "La fusée était trop penchée ! ";
      
      this.handleCrash(messageErreur);
      return;
    }

    // Activation du mode atterrissage progressif
    this.isLandingInProgress = true;
    this.lastValidPadConfig = padConfig;
    rocketSprite.body.isLandingInProgress = true; 

    // Active le gros frein horizontal pour contrer le patinage
    rocketSprite.body.setDragX(2000); 
    rocketSprite.setAngularVelocity(0);

    // Initialisation immédiate du calculateur de stabilité
    this.stableStartTime = this.scene.time.now;

    // --- TIMER UNIQUE DE RECHARGE FUEL ---
    if (!this.fuelRefillTimer) {
      this.fuelRefillTimer = this.scene.time.addEvent({
        delay: 1000, 
        loop: true,  
        callback: () => {
          if (typeof this.rocket.addFuel === 'function') {
            this.rocket.addFuel(5); 
          } else if (this.rocket.fuel !== undefined && this.rocket.fuel < 100) {
            this.rocket.fuel = Math.min(100, this.rocket.fuel + 5);
            if (this.rocket.fuelText) {
              this.rocket.fuelText.setText('Fuel: ' + Math.floor(this.rocket.fuel) + '%');
            }
          }
        },
        callbackScope: this
      });
    }
  }

  cancelLandingTimers() {
    this.isLandingInProgress = false;
    this.stableStartTime = 0;
    
    if (this.rocket && this.rocket.sprite && this.rocket.sprite.body) {
      this.rocket.sprite.body.setDragX(0); 
      this.rocket.sprite.body.isLandingInProgress = false; 
      this.rocket.sprite.body.setAcceleration(0, 0); // Nettoie les accélérations résiduelles
    }

    if (this.fuelRefillTimer) {
      this.fuelRefillTimer.destroy();
      this.fuelRefillTimer = null;
    }
  }

  handleCrash(message) {
    if (this.levelOver) return;
    this.levelOver = true;
    
    this.cancelLandingTimers();

    const explosionGraphics = this.scene.add.graphics();
    explosionGraphics.fillStyle(0xff6600, 1);
    explosionGraphics.fillCircle(this.rocket.sprite.x, this.rocket.sprite.y, 30);

    this.onCrash(message);
  }

  destroy() {
    this.cancelLandingTimers();
    this.landingPads.forEach(pad => pad.destroy());
    this.landingPads = [];
  }
}