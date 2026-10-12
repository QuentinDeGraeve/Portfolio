export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    const w = this.scale.width, h = this.scale.height;
    this.add.text(w / 2, h / 2 - 40, 'Chargement...', { fontSize: '24px' }).setOrigin(0.5);

    // Charger les sprites et audio si disponibles
    // this.load.image('rocket', 'assets/sprites/rocket.png');
    // this.load.image('fuel_pickup', 'assets/sprites/fuel.png');
    // this.load.audio('bgmMenu', 'assets/audio/music/menu.wav');
    // this.load.audio('bgmGame', 'assets/audio/music/game.wav');
    // this.load.audio('bgmWin', 'assets/audio/music/win.wav');
    // this.load.audio('bgmGameOver', 'assets/audio/music/gameover.wav');
  }

  create() {
    // Créer le sprite du vaisseau (fusée) avec une texture canvas
    if (!this.textures.exists('rocket')) {
      let canvas = this.textures.createCanvas('rocket', 32, 40);
      let ctx = canvas.context;

      // Corps de la fusée
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(16, 2);   // Nez pointu en haut
      ctx.lineTo(22, 28);  // Côté droit
      ctx.lineTo(10, 28);  // Côté gauche
      ctx.closePath();
      ctx.fill();

      // Fenêtre
      ctx.fillStyle = '#0099ff';
      ctx.beginPath();
      ctx.arc(16, 12, 4, 0, Math.PI * 2);
      ctx.fill();

      // Flammes en bas (inactif)
      //ctx.fillStyle = '#ff6600';
      //ctx.fillRect(12, 28, 4, 8);
      //ctx.fillRect(16, 28, 4, 8);

      canvas.refresh();
    }

    // Créer le sprite du fuel pickup
    if (!this.textures.exists('fuel_pickup')) {
      let canvas = this.textures.createCanvas('fuel_pickup', 16, 16);
      let ctx = canvas.context;

      // Carburant (carré jaune)
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(2, 2, 12, 12);

      // Bordure
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, 12, 12);

      canvas.refresh();
    }

    this.scene.start('Menu');
  }
}

