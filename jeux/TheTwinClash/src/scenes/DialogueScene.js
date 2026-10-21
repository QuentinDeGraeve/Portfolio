import { STEPS, NAMES, COLORS, runStep } from '../story/storyScript.js';
import DialogueVoice from '../ui/DialogueVoice.js';

// Scène de dialogue plein écran (cinématique). Clic / ESPACE / ENTRÉE : réplique suivante.
export default class DialogueScene extends Phaser.Scene {
  constructor() { super('Dialogue'); }

  create(data) {
    this.stepId = data.step;
    this.step = STEPS[this.stepId];
    this.index = -1;
    this.typing = null;
    this.leaving = false;
    this.voice = new DialogueVoice(this);
    this.phase = this.step.title ? 'title' : 'lines';

    const w = this.scale.width, h = this.scale.height;
    this.sound.stopAll();
    this.add.image(480, 270, 'bg').setDisplaySize(w, h).setTint(0x333344);
    if (this.step.ambience) this.sound.add(this.step.ambience, { loop: true, volume: this.step.ambienceVolume ?? 0.5 }).play();
    if (this.step.music) this.sound.add(this.step.music, { loop: true, volume: 0.5 }).play();

    // Boîte de dialogue
    this.box = this.add.rectangle(w / 2, h - 110, w - 60, 170, 0x000000, 0.8).setStrokeStyle(2, 0xffffff).setVisible(false);
    this.nameText = this.add.text(50, h - 185, '', { fontSize: '20px', fontStyle: 'bold' }).setVisible(false);
    this.lineText = this.add.text(55, h - 150, '', { fontSize: '20px', color: '#ffffff', wordWrap: { width: w - 120 }, lineSpacing: 6 }).setVisible(false);
    this.prompt = this.add.text(w - 50, h - 45, 'ESPACE >', { fontSize: '14px', color: '#aaaaaa' }).setOrigin(1, 0.5).setVisible(false);

    this.titleText = this.add.text(w / 2, h / 2 - 20, this.step.title || '', { fontSize: '38px', fontStyle: 'bold', align: 'center' }).setOrigin(0.5).setAlpha(0);
    this.hintText = this.add.text(w / 2, h / 2 + 60, this.step.hint || '', { fontSize: '16px', color: '#cccccc', align: 'center', lineSpacing: 6 }).setOrigin(0.5).setAlpha(0);

    // Placé sous le bouton plein écran (HTML, en haut à droite) : conversion px CSS -> coordonnées du canvas étiré
    const cv = this.game.canvas;
    const skip = this.add.text(w - 6 * w / cv.clientWidth, 54 * h / cv.clientHeight, 'PASSER >>', { fontSize: '16px', color: '#cccccc', backgroundColor: '#222222', padding: { x: 10, y: 6 } })
      .setOrigin(1, 0).setDepth(10).setInteractive();
    // Le tap sur "Passer" ne doit pas aussi faire avancer la réplique
    skip.on('pointerdown', (pointer, lx, ly, event) => { event.stopPropagation(); this.finish(); });

    this.cameras.main.fadeIn(400, 0, 0, 0);
    this.input.on('pointerdown', () => this.advance());
    this.input.keyboard.on('keydown-SPACE', () => this.advance());
    this.input.keyboard.on('keydown-ENTER', () => this.advance());
    this.input.keyboard.on('keydown-ESC', () => this.finish());

    if (this.phase === 'title') {
      this.tweens.add({ targets: [this.titleText, this.hintText], alpha: 1, duration: 800 });
    } else {
      this.advance();
    }
  }

  advance() {
    if (this.leaving) return;
    if (this.phase === 'title') {
      this.phase = 'lines';
      this.titleText.setVisible(false);
      this.hintText.setVisible(false);
      this.box.setVisible(true);
      this.index = -1;
    } else if (this.typing) {
      // Affiche la réplique en entier
      this.typing.remove(false);
      this.typing = null;
      this.lineText.setText(this.currentLine.text);
      return;
    }

    this.index++;
    if (this.index >= this.step.lines.length) { this.finish(); return; }

    const line = this.step.lines[this.index];
    this.currentLine = line;
    this.box.setVisible(true);
    const narr = line.who === 'N';
    this.nameText.setText(narr ? '' : NAMES[line.who]).setColor(COLORS[line.who]).setVisible(true);
    this.lineText.setVisible(true).setFontStyle(narr ? 'italic' : 'normal').setColor(narr ? '#c8c8c8' : '#ffffff').setText('');
    this.prompt.setVisible(true);

    let i = 0;
    this.typing = this.time.addEvent({
      delay: 18, repeat: line.text.length - 1,
      callback: () => {
        i++;
        this.lineText.setText(line.text.slice(0, i));
        this.voice.tick(line.who, line.text[i - 1]);
        if (i >= line.text.length) this.typing = null;
      }
    });
  }

  finish() {
    if (this.leaving) return;
    this.leaving = true;
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => runStep(this, this.step.next));
  }
}
