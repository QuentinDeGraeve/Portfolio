export default {
  sceneKey: 'Level2',
  label: 'LEVEL 2',
  buttonColor: 0x2196F3,
  buttonHoverColor: 0x0b7dda,
  backgroundColor: 0x000000,
  rocketStart: { x: 150, y: 350 },
  gameplay: {
    gravityZones: [
      { x: 150, y: 480, radius: 200, strength: 300 },
      { x: 650, y: 480, radius: 280, strength: 600 }
    ],
    planetSurfaces: [
      {
        x: 150,
        y: 480,
        radius: 60,
        color: 0x4169E1,
        alpha: 0.8,
        crashMessage: 'Crashed into Planet A!'
      },
      {
        x: 650,
        y: 480,
        radius: 80,
        color: 0xFF6347,
        alpha: 0.8,
        crashMessage: 'Crashed into Planet B!'
      }
    ],
    landingPads: [
      {
        x: 150,
        y: 380,
        width: 100,
        height: 20,
        goal: false,
        refuelAmount: 50,
        refuelMessage: 'Fuel restored!'
      },
      {
        x: 650,
        y: 360,
        width: 100,
        height: 20,
        goal: true,
        requiresResource: false,
        successMessage: 'Landing successful!',
        failMessage: ''
      }
    ],
    fuelPickups: [
      { x: 250, y: 300, amount: 35 },
      { x: 300, y: 200, amount: 35 },
      { x: 500, y: 200, amount: 40 },
      { x: 550, y: 300, amount: 35 }
    ],
    resources: [      
      { x: 400, y: 150, size: 20, color: 0xFFD700, collectedColor: 0x00ff00 }
    ],
    screenBounds: { minX: 0, maxX: 800, minY: 0, maxY: 600 },
    landingDelay: 2000
  }
};
