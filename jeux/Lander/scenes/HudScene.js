export default class HudScene extends Phaser.Scene {
  constructor() {
    super('HUD');
  }

  init(data) {
    this.rocket = data.rocket;
  }

  create() {
    const w = this.scale.width, h = this.scale.height;

    // Information text
    this.add.text(20, 20, 'Arrow Keys: Rotate | Up: Thrust', {
      fontSize: '14px',
      color: '#ffffff'
    });

    // Fuel bar background
    this.fuelBarBg = this.add.rectangle(w - 120, 30, 100, 20, 0x333333);
    this.fuelBarBg.setStrokeStyle(2, 0xffffff);

    // Fuel bar (left-aligned so it shrinks correctly)
    this.fuelBar = this.add.rectangle(w - 170, 30, 100, 20, 0x44ff44);
    this.fuelBar.setOrigin(0, 0.5);

    // Fuel text
    this.fuelText = this.add.text(w - 260, 20, 'FUEL: 100%', {
      fontSize: '14px',
      color: '#44ff44',
      fontStyle: 'bold'
    });

    // Velocity display
    this.velocityText = this.add.text(w - 230, 50, 'Velocity: 0 m/s', {
      fontSize: '14px',
      color: '#ffffff'
    });

    // Altitude display
    this.altitudeText = this.add.text(w - 230, 80, 'Altitude: 0 m', {
      fontSize: '14px',
      color: '#ffffff'
    });
  }

  update() {
    if (!this.rocket || !this.rocket.sprite) return;

    const rocket = this.rocket;
    const fuelPercent = rocket.getFuelPercent();

    // Update fuel bar
    const barWidth = 100 * (fuelPercent / 100);
    this.fuelBar.width = barWidth;
    this.fuelBar.x = this.cameras.main.width - 170;

    // Color fuel bar based on level
    if (fuelPercent > 50) {
      this.fuelBar.setFillStyle(0x44ff44); // Green
      this.fuelText.setColor('#44ff44');
    } else if (fuelPercent > 25) {
      this.fuelBar.setFillStyle(0xffaa44); // Orange
      this.fuelText.setColor('#ffaa44');
    } else {
      this.fuelBar.setFillStyle(0xff4444); // Red
      this.fuelText.setColor('#ff4444');
    }

    // Update fuel text
    this.fuelText.setText(`FUEL: ${Math.round(fuelPercent)}%`);

    // Update velocity
    const velocity = Math.round(rocket.sprite.body.speed);
    this.velocityText.setText(`Velocity: ${velocity} m/s`);

    // Update altitude (Y position relative to screen)
    const altitude = Math.max(0, 600 - rocket.sprite.y);
    this.altitudeText.setText(`Altitude: ${Math.round(altitude)} m`);
  }
}

