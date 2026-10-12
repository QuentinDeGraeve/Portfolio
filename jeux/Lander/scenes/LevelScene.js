import Rocket from '../entities/Rocket.js';
import GameplaySystem from '../systems/GameplaySystem.js';
import { getLevelConfig } from '../levels/index.js';

export default class LevelScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  create() {
    this.levelConfig = getLevelConfig(this.scene.key);
    if (!this.levelConfig) {
      console.error(`Level config not found for scene ${this.scene.key}`);
      return;
    }

    this.add.rectangle(400, 300, 800, 600, this.levelConfig.backgroundColor);

    this.rocket = new Rocket(this, this.levelConfig.rocketStart.x, this.levelConfig.rocketStart.y);

    this.gameplay = new GameplaySystem(this, this.rocket, {
      ...this.levelConfig.gameplay,
      onCrash: message => this.onGameplayCrash(message),
      onLevelEnd: (success, message) => this.onGameplayEnd(success, message)
    });

    this.keys = this.input.keyboard.createCursorKeys();
    this.gameOver = false;

    if (this.cache.audio.exists('bgmGame')) {
      this.bgmGame = this.sound.add('bgmGame', { loop: true, volume: 0.5 });
      this.bgmGame.play();
    }

    this.scene.launch('HUD', { rocket: this.rocket });
  }

  update() {
    if (this.gameOver) return;
    if (this.gameplay) {
      this.gameplay.update(this.keys);
    }
  }

  onGameplayCrash(message) {
    if (this.gameOver) return;

    this.gameOver = true;
    this.scene.stop('HUD');

    if (this.bgmGame?.isPlaying) {
      this.bgmGame.stop();
    }

    this.time.delayedCall(500, () => {
      this.scene.start('EndScene', {
        success: false,
        message: message || 'Mission failed',
        levelKey: this.scene.key
      });
    });
  }

  onGameplayEnd(success, message = '') {
    if (this.gameOver) return;

    this.gameOver = true;
    this.scene.stop('HUD');

    if (this.bgmGame?.isPlaying) {
      this.bgmGame.stop();
    }

    this.time.delayedCall(500, () => {
      this.scene.start('EndScene', {
        success,
        message,
        levelKey: this.scene.key
      });
    });
  }
}
