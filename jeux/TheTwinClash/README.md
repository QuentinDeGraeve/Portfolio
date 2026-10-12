Phaser 3 - Combat vs Bot (v2)
==============================
This version adds:
- Animated spritesheets (placeholder frames) and animations: idle/run/punch/hit/death
- Player state machine: idle/run/attack/stun/dash/special and combo system
- Bot AI: approach, attack combos, heavy attack, dash and evade behaviors
- Particles and hit effects

How to run:
1) Serve the folder with a static server (modules require http).
   Example:
     python -m http.server 8000
   Then open http://localhost:8000

Controls:
- LEFT / RIGHT arrows: move
- SPACE: attack (combo up to 3)
- SHIFT: special heavy attack (cooldown)
- D: dash

Files:
- index.html
- src/ (main, scenes, entities, ui)
- assets/ (sprites and audio placeholders)

Notes:
- Replace the placeholder spritesheet PNGs in assets/sprites with your own spritesheets (same frame dimensions: 96x128, 6 frames).
- Animations are defined in PreloadScene.js and mapped to frame ranges; update ranges to match actual sheets.
