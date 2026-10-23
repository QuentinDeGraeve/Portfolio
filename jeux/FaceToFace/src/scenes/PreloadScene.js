import { QUESTIONS } from '../data/questions.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() { super('Preload'); }

  preload() {
    const w = this.scale.width, h = this.scale.height;
    this.add.text(w/2, h/2 - 40, 'Chargement...', { fontSize: '24px' }).setOrigin(0.5);

    // Un asset manquant ne doit pas bloquer le jeu : on ignore simplement l'erreur
    this.load.on('loaderror', () => {});

    QUESTIONS.forEach(q => this.load.image(q.key, `assets/photos/${q.file}`));

    this.load.image('bg', 'assets/sprites/images/bg.jpg');
    this.load.image('bg2', 'assets/sprites/images/bg2.jpg');
    this.load.image('menu', 'assets/sprites/images/menu.jpg');

    this.load.audio('bgmMenu', 'assets/audio/music/music_menu.mp3');
    this.load.audio('bgmGame', 'assets/audio/music/music_game.mp3');
    this.load.audio('bgmResult', 'assets/audio/music/music_fin.mp3');

    this.load.video('videoVictoire', 'assets/video/victoire.mp4', 'loadeddata', false, false);
    this.load.video('videoTriste', 'assets/video/triste.mp4', 'loadeddata', false, false);

    // Effets sonores : un son tiré au hasard à chaque réponse
    this.load.audio('sfxGood1', 'assets/audio/effect/good/528957__beetlemuse__correct-answer-thats-right.wav');
    this.load.audio('sfxGood2', 'assets/audio/effect/good/587252__beetlemuse__dats-right.wav');
    this.load.audio('sfxGood3', 'assets/audio/effect/good/610703__oggraphics__good-answer-harp-glissando.wav');
    this.load.audio('sfxBad1', 'assets/audio/effect/bad/216090__richerlandtv__bad-beep-incorrect.mp3');
    this.load.audio('sfxBad2', 'assets/audio/effect/bad/528956__beetlemuse__wrong-answer-incorrect-error.wav');
    this.load.audio('sfxBad3', 'assets/audio/effect/bad/587253__beetlemuse__dats-wrong.wav');
  }

  create() {
    this.scene.start('Menu');
  }
}
