// Compte à rebours "3, 2, 1, FIGHT !" affiché au centre de l'écran avant le début d'un combat.
// `onDone` est appelé au moment où "FIGHT !" apparaît (le jeu peut alors démarrer).
const STEPS = ['3', '2', '1', 'FIGHT !'];
const STEP_MS = 800;

export default function runCountdown(scene, onDone) {
  const text = scene.add.text(480, 250, '', {
    fontSize: '120px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 8
  }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

  STEPS.forEach((label, i) => {
    scene.time.delayedCall(i * STEP_MS, () => {
      const last = i === STEPS.length - 1;
      scene.tweens.killTweensOf(text);
      text.setText(label).setColor(last ? '#ffd166' : '#ffffff').setAlpha(1).setScale(last ? 0.6 : 1.4);
      scene.tweens.add({
        targets: text, scale: 1, duration: 250, ease: 'Back.Out'
      });
      scene.sound.play(last ? 'special' : 'hit', { volume: 0.4 });
      if (last) {
        onDone();
        scene.tweens.add({ targets: text, alpha: 0, duration: 500, delay: 500, onComplete: () => text.destroy() });
      }
    });
  });
}
