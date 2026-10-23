import { QUESTIONS, QUESTION_COUNT } from '../data/questions.js';

const CHOICES = [
  { id: 'heloise', label: 'HÉLOÏSE', color: 0xb44fd6, hover: 0x9a3fbb, x: 330 },
  { id: 'adele',   label: 'ADÈLE',   color: 0x2196F3, hover: 0x0b7dda, x: 630 }
];
const PHOTO_BOX = { x: 480, y: 235, w: 420, h: 320 };
const BTN_Y = 480;
const NEXT_DELAY = 1200;

export default class QuizScene extends Phaser.Scene {
  constructor() { super('Quiz'); }

  create() {
    const w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor('#10121a');

    if (this.cache.audio.exists('bgmGame')) {
      this.sound.stopAll();
      this.sound.play('bgmGame', { loop: true, volume: 0.3 });
    }

    if (this.textures.exists('bg2')) {
      this.add.image(w/2, h/2, 'bg2').setDisplaySize(w, h);
    }

    // Ordre aléatoire à chaque partie (Fisher-Yates), puis on ne garde que QUESTION_COUNT photos
    this.questions = QUESTIONS.slice();
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
    }
    this.questions = this.questions.slice(0, QUESTION_COUNT);
    this.index = 0;
    this.score = 0;
    this.locked = false;

    const textStyle = { fontSize: '22px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
    this.questionText = this.add.text(35, 30, '', textStyle);
    this.scoreText = this.add.text(w - 35, 30, '', textStyle).setOrigin(1, 0);
    this.descriptionText = this.add.text(w/2, 412, '', { ...textStyle, fontSize: '22px', fontStyle: 'italic', color: '#cccccc', strokeThickness: 3 }).setOrigin(0.5);
    this.feedbackText = this.add.text(w/2, 437, '', { ...textStyle, fontSize: '20px' }).setOrigin(0.5);

    this.photoObjects = [];
    this.buttons = CHOICES.map(c => {
      const rect = this.add.rectangle(c.x, BTN_Y, 240, 50, c.color)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(2, 0xffffff);
      this.add.text(c.x, BTN_Y, c.label, { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
      rect.on('pointerover', () => { if (!this.locked) rect.setFillStyle(c.hover); });
      rect.on('pointerout', () => { if (!this.locked) rect.setFillStyle(c.color); });
      rect.on('pointerdown', () => this.answer(c.id));
      return { ...c, rect };
    });

    this.showQuestion();
  }

  showQuestion() {
    const q = this.questions[this.index];
    this.locked = false;
    this.feedbackText.setText('');
    this.descriptionText.setText(q.description || '');
    this.questionText.setText(`Question ${this.index + 1}/${this.questions.length}`);
    this.scoreText.setText(`Score : ${this.score}`);
    this.buttons.forEach(b => b.rect.setFillStyle(b.color));

    this.photoObjects.forEach(o => o.destroy());
    this.photoObjects = [];

    const { x, y, w, h } = PHOTO_BOX;
    this.photoObjects.push(this.add.rectangle(x, y, w + 8, h + 8, 0x000000).setStrokeStyle(2, 0xffffff));

    if (this.textures.exists(q.key)) {
      const img = this.add.image(x, y, q.key);
      const scale = Math.min(w / img.width, h / img.height);
      img.setScale(scale);
      this.photoObjects.push(img);
    } else {
      this.photoObjects.push(
        this.add.text(x, y, `${q.key} manquante`, { fontSize: '20px', color: '#aaaaaa' }).setOrigin(0.5)
      );
    }
  }

  answer(choiceId) {
    if (this.locked) return;
    this.locked = true;

    const q = this.questions[this.index];
    const correct = choiceId === q.answer;
    if (correct) this.score++;

    // Son au hasard parmi ceux chargés pour une bonne / mauvaise réponse
    const prefix = correct ? 'sfxGood' : 'sfxBad';
    const sfx = [1, 2, 3].map(n => prefix + n).filter(k => this.cache.audio.exists(k));
    if (sfx.length) this.sound.play(Phaser.Utils.Array.GetRandom(sfx), { volume: 0.8 });

    this.buttons.forEach(b => {
      if (b.id === q.answer) b.rect.setFillStyle(0x44cc66);
      else if (b.id === choiceId) b.rect.setFillStyle(0xff4444);
    });
    this.feedbackText
      .setText(correct ? 'Bonne réponse !' : `Raté ! C'était ${q.answer === 'heloise' ? 'Héloïse' : 'Adèle'}`)
      .setColor(correct ? '#44ff88' : '#ff4444');
    this.scoreText.setText(`Score : ${this.score}`);

    this.time.delayedCall(NEXT_DELAY, () => {
      this.index++;
      if (this.index >= this.questions.length) {
        this.scene.start('Video', { score: this.score, total: this.questions.length });
      } else {
        this.showQuestion();
      }
    });
  }
}
