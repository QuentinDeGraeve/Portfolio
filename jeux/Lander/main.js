import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelScene from './scenes/LevelScene.js';
import EndScene from './scenes/EndScene.js';
import HudScene from './scenes/HudScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    new LevelScene('Level1'),
    new LevelScene('Level2'),
    HudScene,
    EndScene
  ],
  callbacks: {
    postBoot: (game) => {
      // Met le jeu en pause quand l'app passe en arrière-plan
      document.addEventListener("pause", () => {
        game.loop.stop();
        console.log("Jeu en pause (Appel reçu ou mise en arrière-plan)");
      });

      // Relance le jeu quand on revient sur l'app
      document.addEventListener("resume", () => {
        game.loop.start();
        console.log("Jeu repris");
      });
    }
  }
};

window.game = new Phaser.Game(config);
