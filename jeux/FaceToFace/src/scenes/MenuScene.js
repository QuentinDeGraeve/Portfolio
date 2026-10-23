export default class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    const w = this.scale.width, h = this.scale.height;

    if (this.cache.audio.exists('bgmMenu')) {
      this.sound.stopAll();
      this.sound.play('bgmMenu', { loop: true, volume: 0.5 });
    }

    if (this.textures.exists('menu')) {
      this.add.image(w/2, h/2, 'menu').setDisplaySize(w, h);
    }

    const stroke = { stroke: '#000000', strokeThickness: 6 };
    //this.add.text(w/2, h/2 - 80, 'FACE TO FACE', { fontSize: '48px', fontStyle: 'bold', color: '#ffffff', ...stroke }).setOrigin(0.5);
    //this.add.text(w/2, h/2 - 20, 'Héloïse ou Adèle ?  10 Question - il faut 7/10 pour gagner', { fontSize: '16px', color: '#ffffff', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5);

    const bx = w/2, by = h/2 + 60;
    const button = this.add.rectangle(bx, by, 200, 50, 0x4CAF50)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff);
    this.add.text(bx, by, 'JOUER', { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0x45a049));
    button.on('pointerout', () => button.setFillStyle(0x4CAF50));
    button.on('pointerdown', () => this.scene.start('Quiz'));
  }
}
