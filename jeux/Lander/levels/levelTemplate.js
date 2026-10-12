export default {
  sceneKey: 'LevelX',
  label: 'LEVEL X',
  buttonColor: 0x4CAF50,
  buttonHoverColor: 0x45a049,
  backgroundColor: 0x001a4d,
  rocketStart: { x: 400, y: 320 },
  gameplay: {
    gravityZones: [
      { x: 400, y: 700, radius: 450, strength: 100 }
    ],
    planetSurfaces: [
      {
        x: 400,
        y: 700,
        radius: 180,
        color: 0x8B4513,
        alpha: 0.7,
        crashMessage: 'Crashed into planet!'
      }
    ],
    landingPads: [
      {
        x: 400,
        y: 360,
        width: 100,
        height: 20,
        goal: true,
        requiresResource: false,
        // refuelAmount: 50, // optional: recharge on safe pad landing
        // refuelMessage: 'Fuel restored!'
        successMessage: 'Landing successful!',
        failMessage: 'Landing failed: too fast, tilted, or bouncing'
      }
    ],
    fuelPickups: [
      { x: 200, y: 250, amount: 25 },
      { x: 600, y: 280, amount: 25 }
    ],
    resources: [],
    screenBounds: { minX: 0, maxX: 800, minY: 0, maxY: 600 },
    landingDelay: 2000
  }
};
