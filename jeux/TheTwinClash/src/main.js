import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import HudScene from './scenes/HudScene.js';
import GameOver from './scenes/GameOver.js';
import GameWin from './scenes/GameWin.js';
import DialogueScene from './scenes/DialogueScene.js';
import ShooterScene from './scenes/ShooterScene.js';
import StoryEndScene from './scenes/StoryEndScene.js';

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
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene, HudScene, GameOver, GameWin, DialogueScene, ShooterScene, StoryEndScene]
};

window.game = new Phaser.Game(config);
