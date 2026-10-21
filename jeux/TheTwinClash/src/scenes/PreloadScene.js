export default class PreloadScene extends Phaser.Scene {
  constructor() { super('Preload'); }

  preload() {
    const w = this.scale.width, h = this.scale.height;
    this.add.text(w/2, h/2 - 40, 'Chargement...', { fontSize: '24px' }).setOrigin(0.5);

    // spritesheets (frames: 6 frames each, frame size 96x128)
    this.load.spritesheet('adele_fighter', 'assets/sprites/spritesheets/adele_fighter_spritesheet.png', { frameWidth: 256, frameHeight: 256, willReadFrequently: true });
    this.load.spritesheet('heloise_fighter', 'assets/sprites/spritesheets/heloise_fighter_spritesheet.png', { frameWidth: 256, frameHeight: 256, willReadFrequently: true });
    this.load.spritesheet('pere_fighter',   'assets/sprites/spritesheets/spritesheetPere.png',   { frameWidth: 150, frameHeight: 150, willReadFrequently: true });
    this.load.spritesheet('enemie_fighter', 'assets/sprites/spritesheets/spritesheetenemie.png', { frameWidth: 150, frameHeight: 150, willReadFrequently: true });

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
    this.load.audio('bgmCombat', 'assets/audio/music/fightSong.mp3');
    this.load.audio('bgmBoss', 'assets/audio/music/bossSong.mp3');
    this.load.audio('bgmGameOver', 'assets/audio/music/SadOmbreFeu.mp3');
    this.load.audio('bgmGameWin', 'assets/audio/music/OmbreFeu.wav');
    this.load.audio('bgmAffronteBoss', 'assets/audio/music/Affronte le Boss.mp3');

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

    // --- Animations du boss (père) ---
    // Ligne 0 (frames 0-3) : Idle
    this.anims.create({
      key: 'pere_idle',
      frames: this.anims.generateFrameNumbers('pere_fighter', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    // Ligne 9 (frames 36-39) : Walk
    this.anims.create({
      key: 'pere_walk',
      frames: this.anims.generateFrameNumbers('pere_fighter', { start: 36, end: 39 }),
      frameRate: 8,
      repeat: 0
    });

    // Ligne 3 (frames 12-15) : Punch
    this.anims.create({
      key: 'pere_punch',
      frames: [
        { key: 'pere_fighter', frame: 12 },
        { key: 'pere_fighter', frame: 13 },
        { key: 'pere_fighter', frame: 14 },
        { key: 'pere_fighter', frame: 15 }
      ],
      frameRate: 12,
      repeat: 0
    });

    // Lignes 4-5 (frames 18, 19, 21, 22) : Kick
    this.anims.create({
      key: 'pere_kick',
      frames: [
        { key: 'pere_fighter', frame: 18 },
        { key: 'pere_fighter', frame: 19 },
        { key: 'pere_fighter', frame: 21 },
        { key: 'pere_fighter', frame: 22 }
      ],
      frameRate: 10,
      repeat: 0
    });

    // Lignes 10 & 4 (frames 41, 42, 43, 16, 17) : Special
    this.anims.create({
      key: 'pere_special',
      frames: [
        { key: 'pere_fighter', frame: 41 },
        { key: 'pere_fighter', frame: 42 },
        { key: 'pere_fighter', frame: 43 },
        { key: 'pere_fighter', frame: 16 },
        { key: 'pere_fighter', frame: 17 }
      ],
      frameRate: 10,
      repeat: 0
    });

    // Lignes 5 & 7 (frames 23, 28) : Hurt / Block
    this.anims.create({
      key: 'pere_hurt',
      frames: [
        { key: 'pere_fighter', frame: 23 },
        { key: 'pere_fighter', frame: 28 }
      ],
      frameRate: 8,
      repeat: 0
    });

    // Lignes 8 & 6 (frames 34, 26, 22) : Jump
    this.anims.create({
      key: 'pere_jump',
      frames: [
        { key: 'pere_fighter', frame: 34 },
        { key: 'pere_fighter', frame: 26 },
        { key: 'pere_fighter', frame: 22 }
      ],
      frameRate: 8,
      repeat: 0
    });

    // Ligne 10 (frames 40-43) : Dash
    this.anims.create({
      key: 'pere_dash',
      frames: this.anims.generateFrameNumbers('pere_fighter', { start: 40, end: 43 }),
      frameRate: 12,
      repeat: 0
    });

    // Death (frames 23, 28, 29)
    this.anims.create({
      key: 'boss_death',
      frames: [
        { key: 'pere_fighter', frame: 23 },
        { key: 'pere_fighter', frame: 28 },
        { key: 'pere_fighter', frame: 29 }
      ],
      frameRate: 5,
      repeat: 0
    });

    // --- Animations de l'ennemi (mode Survie) ---
    // Ligne 0 (frames 0-3) : Idle
    this.anims.create({
      key: 'enemie_idle',
      frames: this.anims.generateFrameNumbers('enemie_fighter', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    // Ligne 1 (frames 4-7) : Walk
    this.anims.create({
      key: 'enemie_walk',
      frames: this.anims.generateFrameNumbers('enemie_fighter', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.start('Menu');
  }
}
