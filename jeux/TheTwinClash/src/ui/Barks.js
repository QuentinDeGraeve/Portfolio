import { NAMES, COLORS } from '../story/storyScript.js';

// Sous-titres de dialogue affichés pendant un combat (file d'attente de répliques).
export default class Barks {
  constructor(scene) {
    this.scene = scene;
    this.queue = [];
    this.busy = false;
    this.box = scene.add.rectangle(480, 492, 900, 62, 0x000000, 0.7).setScrollFactor(0).setDepth(200).setVisible(false);
    this.name = scene.add.text(40, 466, '', { fontSize: '14px', fontStyle: 'bold' }).setScrollFactor(0).setDepth(201).setVisible(false);
    this.text = scene.add.text(40, 486, '', { fontSize: '16px', color: '#ffffff', wordWrap: { width: 880 } }).setScrollFactor(0).setDepth(201).setVisible(false);
  }

  say(lines) {
    this.queue.push(...lines);
    if (!this.busy) this.next();
  }

  next() {
    const line = this.queue.shift();
    if (!line) {
      this.busy = false;
      this.box.setVisible(false); this.name.setVisible(false); this.text.setVisible(false);
      return;
    }
    this.busy = true;
    this.box.setVisible(true);
    this.name.setText(NAMES[line.who]).setColor(COLORS[line.who]).setVisible(true);
    this.text.setText(line.text).setVisible(true);
    this.scene.time.delayedCall(Math.max(2200, line.text.length * 55), () => this.next());
  }
}
