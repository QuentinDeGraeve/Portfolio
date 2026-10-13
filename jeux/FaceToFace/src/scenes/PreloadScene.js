import { QUESTIONS } from '../data/questions.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() { super('Preload'); }

  preload() {
    const w = this.scale.width, h = this.scale.height;
    this.add.text(w/2, h/2 - 40, 'Chargement...', { fontSize: '24px' }).setOrigin(0.5);

    // Un asset manquant ne doit pas bloquer le jeu : on ignore simplement l'erreur
    this.load.on('loaderror', () => {});

    QUESTIONS.forEach(q => this.load.image(q.key, `assets/photos/${q.file}`));

    this.load.image('bg', 'assets/sprites/images/bg.png');
    this.load.image('menu', 'assets/sprites/images/menu.png');

    this.load.audio('bgmMenu', 'assets/audio/music/OmbreFeu.wav');
    this.load.audio('bgmResult', 'assets/audio/music/SadOmbreFeu.mp3');
  }

  create() {
    this.scene.start('Menu');
  }
}
