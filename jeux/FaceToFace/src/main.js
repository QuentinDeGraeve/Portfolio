import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import QuizScene from './scenes/QuizScene.js';
import VideoScene from './scenes/VideoScene.js';
import ResultScene from './scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'game-container',
  scale: {
    // Taille CSS gérée par index.html (canvas étiré sur tout l'écran)
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.NO_CENTER
  },
  backgroundColor: '#10121a',
  scene: [BootScene, PreloadScene, MenuScene, QuizScene, VideoScene, ResultScene]
};

function launchGame() {
  if (window.game) return;
  window.game = new Phaser.Game(config);
}

if (sessionStorage.getItem('facetoface_authenticated') === 'true') {
  launchGame();
} else {
  window.addEventListener('facetoface:unlocked', launchGame);
}
