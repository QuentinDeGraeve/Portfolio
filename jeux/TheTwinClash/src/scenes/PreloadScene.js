export default class PreloadScene extends Phaser.Scene {
  constructor() { super('Preload'); }

  preload() {
    const w = this.scale.width, h = this.scale.height;
    this.add.text(w/2, h/2 - 40, 'Chargement...', { fontSize: '24px' }).setOrigin(0.5);

    // spritesheets (frames: 6 frames each, frame size 96x128)
    this.load.spritesheet('adele_fighter', 'assets/sprites/spritesheets/adele_fighter_spritesheet.png', { frameWidth: 256, frameHeight: 256, willReadFrequently: true });
    this.load.spritesheet('heloise_fighter', 'assets/sprites/spritesheets/heloise_fighter_spritesheet.png', { frameWidth: 256, frameHeight: 256, willReadFrequently: true });

    // small hit/spark sprite
    this.load.image('hit', 'assets/sprites/hit.png');

    // background and menu images
    this.load.image('bg', 'assets/sprites/images/bg.png');
    this.load.image('menu', 'assets/sprites/images/menu.png');
    this.load.image('bgRingHaut', 'assets/sprites/images/bgRingHaut.jpg');

    // audio
    this.load.audio('punch', 'assets/audio/sound/punch.wav');
    this.load.audio('kick', 'assets/audio/sound/punch.wav');
    this.load.audio('hit', 'assets/audio/sound/hit.wav');
    this.load.audio('dash', 'assets/audio/sound/dash.wav');
    this.load.audio('special', 'assets/audio/sound/special.wav');
    this.load.audio('ambArena', 'assets/audio/sound/497696__syntaxseed__fight-arena-4.wav');
    this.load.audio('ambBoo', 'assets/audio/sound/25270__freesound__to_be_booed2_ses1.wav');

    // background music
    this.load.audio('bgmMenu', 'assets/audio/music/OmbreFeu.wav');
    this.load.audio('bgmCombat', 'assets/audio/music/OmbreFeu.wav');
    this.load.audio('bgmGameOver', 'assets/audio/music/SadOmbreFeu.mp3');
    this.load.audio('bgmGameWin', 'assets/audio/music/SadOmbreFeu.mp3');

  }

  create() {

    // --- Création des animations pour Adèle ---
    // 1. IDLE (Repos) - Ligne 1
    this.anims.create({
      key: 'adele_idle',
      frames: this.anims.generateFrameNumbers('adele_fighter', { start: 0, end: 6 }),
      frameRate: 5, // Vitesse de l'animation
      repeat: -1    // Répéter indéfiniment
    });

    // 2. WALK FORWARD (Marche avant) - Ligne 2
    this.anims.create({
      key: 'adele_walk',
      //frames: this.anims.generateFrameNumbers('adele_fighter', { start: 11, end: 18 }),
      frames: [
        { key: 'adele_fighter', frame: 11},
        { key: 'adele_fighter', frame: 12 },
        { key: 'adele_fighter', frame: 13 },
        { key: 'adele_fighter', frame: 16},
        { key: 'adele_fighter', frame: 17 }
      ],
      frameRate: 8,
      repeat: 0
    });

    // 3. PUNCH (Coup de poing) - Ligne 3
    this.anims.create({
      key: 'adele_punch',
      frames: [
        { key: 'adele_fighter', frame: 22},
        { key: 'adele_fighter', frame: 23 },
        { key: 'adele_fighter', frame: 26 },
        { key: 'adele_fighter', frame: 25 }
      ],
      frameRate: 12,
      repeat: 0 // Ne pas répéter, jouer une fois
    });

    // 4. KICK (Coup de pied) - Ligne 4
    this.anims.create({
      key: 'adele_kick',
      frames: this.anims.generateFrameNumbers('adele_fighter', { start: 33, end: 37 }),
      frameRate: 8,
      repeat: 0
    });

    // 5. SPECIAL MOVE (Coup spécial "Blue Phoenix Suplex") - Ligne 5
    // Note: Ici, les frames pour l'aura bleue et l'explosion énergétique sont spécifiques.
    // Assurez-vous que l'indexation est correcte par rapport à votre spritesheet.
    this.anims.create({
      key: 'adele_special_move',
      frames: [
        { key: 'adele_fighter', frame: 27},
        { key: 'adele_fighter', frame: 23 },
        { key: 'adele_fighter', frame: 24 }
      ],
      frameRate: 10,
      repeat: 0
    });

    // 6. HURT/BLOCK (Blessure/Garde) - Ligne 6
    this.anims.create({
      key: 'adele_hurt_block',
      frames: this.anims.generateFrameNumbers('adele_fighter', { start: 30, end: 35 }),
      frameRate: 8,
      repeat: 0
    });

    // 7. JUMP (Saut) - Ligne 7
    this.anims.create({
      key: 'adele_jump',
      //frames: this.anims.generateFrameNumbers('adele_fighter', { start: 44, end: 55 }),
      frames: [
        { key: 'adele_fighter', frame: 45},
        { key: 'adele_fighter', frame: 49 },
        { key: 'adele_fighter', frame: 50 },
        { key: 'adele_fighter', frame: 51},
        { key: 'adele_fighter', frame: 52 },
        { key: 'adele_fighter', frame: 53}
      ],
      frameRate: 8,
      repeat: 0
    });

    // 8. CROUCH (Accroupissement) - Ligne 8
    this.anims.create({
      key: 'adele_crouch',
      frames: this.anims.generateFrameNumbers('adele_fighter', { start:56, end: 58 }),
      frameRate: 8,
      repeat: 0
    });

    // 9. DASH (Bond avant) - Ligne 9
    this.anims.create({
      key: 'adele_dash',
      frames: this.anims.generateFrameNumbers('adele_fighter', { start: 60, end: 63 }),
      frameRate: 12, // Un dash est généralement rapide
      repeat: 0
    });


    // --- Création des animations pour Héloïse ---
    // 1. IDLE (Repos) - Ligne 1
    this.anims.create({
      key: 'heloise_idle',
      frames: this.anims.generateFrameNumbers('heloise_fighter', { start: 0, end: 6 }),
      frameRate: 5, // Vitesse de l'animation
      repeat: -1    // Répéter indéfiniment
    });

    // 2. WALK FORWARD (Marche avant) - Ligne 2
    this.anims.create({
      key: 'heloise_walk',
      //frames: this.anims.generateFrameNumbers('heloise_fighter', { start: 11, end: 18 }),
      frames: [
        { key: 'heloise_fighter', frame: 11},
        { key: 'heloise_fighter', frame: 12 },
        { key: 'heloise_fighter', frame: 13 },
        { key: 'heloise_fighter', frame: 16},
        { key: 'heloise_fighter', frame: 17 }
      ],
      frameRate: 8,
      repeat: 0
    });

    // 3. PUNCH (Coup de poing) - Ligne 3
    this.anims.create({
      key: 'heloise_punch',
      frames: [
        { key: 'heloise_fighter', frame: 22},
        { key: 'heloise_fighter', frame: 23 },
        { key: 'heloise_fighter', frame: 26 },
        { key: 'heloise_fighter', frame: 25 }
      ],
      frameRate: 12,
      repeat: 0 // Ne pas répéter, jouer une fois
    });

    // 4. KICK (Coup de pied) - Ligne 4
    this.anims.create({
      key: 'heloise_kick',
      frames: this.anims.generateFrameNumbers('heloise_fighter', { start: 33, end: 37 }),
      frameRate: 8,
      repeat: 0
    });

    // 5. SPECIAL MOVE (Coup spécial "Blue Phoenix Suplex") - Ligne 5
    // Note: Ici, les frames pour l'aura bleue et l'explosion énergétique sont spécifiques.
    // Assurez-vous que l'indexation est correcte par rapport à votre spritesheet.
    this.anims.create({
      key: 'heloise_special_move',
      frames: [
        { key: 'heloise_fighter', frame: 27},
        { key: 'heloise_fighter', frame: 23 },
        { key: 'heloise_fighter', frame: 24 }
      ],
      frameRate: 10,
      repeat: 0
    });

    // 6. HURT/BLOCK (Blessure/Garde) - Ligne 6
    this.anims.create({
      key: 'heloise_hurt_block',
      frames: this.anims.generateFrameNumbers('heloise_fighter', { start: 30, end: 35 }),
      frameRate: 8,
      repeat: 0
    });

    // 7. JUMP (Saut) - Ligne 7
    this.anims.create({
      key: 'heloise_jump',
      //frames: this.anims.generateFrameNumbers('heloise_fighter', { start: 44, end: 55 }),
      frames: [
        { key: 'heloise_fighter', frame: 45},
        { key: 'heloise_fighter', frame: 49 },
        { key: 'heloise_fighter', frame: 50 },
        { key: 'heloise_fighter', frame: 51},
        { key: 'heloise_fighter', frame: 52 },
        { key: 'heloise_fighter', frame: 53}
      ],
      frameRate: 8,
      repeat: 0
    });

    // 8. CROUCH (Accroupissement) - Ligne 8
    this.anims.create({
      key: 'heloise_crouch',
      frames: this.anims.generateFrameNumbers('heloise_fighter', { start:56, end: 58 }),
      frameRate: 8,
      repeat: 0
    });

    // 9. DASH (Bond avant) - Ligne 9
    this.anims.create({
      key: 'heloise_dash',
      frames: this.anims.generateFrameNumbers('heloise_fighter', { start: 60, end: 63 }),
      frameRate: 12, // Un dash est généralement rapide
      repeat: 0
    });  

    // Death animations
    this.anims.create({ key: 'player_death', frames: this.anims.generateFrameNumbers('adele_fighter', { start: 5, end: 5 }), frameRate: 1, repeat: 0 });
    this.anims.create({ key: 'bot_death', frames: this.anims.generateFrameNumbers('heloise_fighter', { start: 5, end: 5 }), frameRate: 1, repeat: 0 });


    this.scene.start('Menu');
  }
}
