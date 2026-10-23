import { WIN_SCORE } from '../data/questions.js';

// Vidéo de fin (avec son, format d'origine) : victoire si gagné, triste si perdu, puis écran de résultat
export default class VideoScene extends Phaser.Scene {
  constructor() { super('Video'); }

  create(data) {
    const w = this.scale.width, h = this.scale.height;
    const score = data.score ?? 0, total = data.total ?? 10;
    const key = score >= WIN_SCORE ? 'videoVictoire' : 'videoTriste';

    this.sound.stopAll();
    this.cameras.main.setBackgroundColor('#000000');

    let done = false;
    const next = () => {
      if (done) return;
      done = true;
      this.scene.start('Result', { score, total });
    };

    if (!this.cache.video.exists(key)) { next(); return; }

    const video = this.add.video(w/2, h/2, key);
    // Garde le ratio d'origine, ajusté à l'écran (la taille est connue dès la création car la vidéo vient du cache)
    const fit = () => { if (video.width && video.height) video.setScale(Math.min(w / video.width, h / video.height)); };
    fit();
    video.on('created', fit);
    video.on('complete', next);
    video.on('error', next);
    video.play();

    // Clic ou touche pour passer la vidéo
    this.input.once('pointerdown', next);
    this.input.keyboard.once('keydown-SPACE', next);
  }
}
