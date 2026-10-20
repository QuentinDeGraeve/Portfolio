// Voix synthétisées (blips type "Animal Crossing") pour les dialogues, via Web Audio.
// Chaque personnage a un timbre et une hauteur propres. Le narrateur (N) reste muet.
const VOICES = {
  A:  { wave: 'triangle', base: 520, range: 90,  dur: 0.07, vol: 0.20 }, // Adèle : claire
  B:  { wave: 'square',   base: 640, range: 110, dur: 0.06, vol: 0.10 }, // Héloïse : aiguë
  P:  { wave: 'sawtooth', base: 120, range: 25,  dur: 0.10, vol: 0.14 }, // Père : grave, rugueux
  PR: { wave: 'square',   base: 330, range: 70,  dur: 0.08, vol: 0.10 }  // Présentateur : médium
};

export default class DialogueVoice {
  constructor(scene) {
    this.ctx = scene.sound && scene.sound.context ? scene.sound.context : null;
    this.count = 0;
  }

  // À appeler à chaque caractère affiché. Un blip toutes les 3 lettres, ignore espaces et ponctuation.
  tick(who, char) {
    const v = VOICES[who];
    if (!this.ctx || !v || !/[\p{L}\p{N}]/u.test(char)) return;
    if (this.count++ % 3) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = v.wave;
    // Hauteur légèrement aléatoire, mais liée à la lettre pour un rendu "parlé" stable
    const step = (char.toLowerCase().charCodeAt(0) % 7) / 7;
    osc.frequency.setValueAtTime(v.base + step * v.range + Math.random() * 15, t);
    osc.frequency.linearRampToValueAtTime(v.base + step * v.range * 0.6, t + v.dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(v.vol, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + v.dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + v.dur + 0.02);
  }
}
