# The Twin Clash

Jeu de combat 2D en navigateur (Phaser 3) : deux sœurs jumelles, **Adèle** et **Héloïse**, tentent d'échapper à leur père qui les force à se battre dans une arène.

## Modes de jeu

| Mode | Description |
|------|-------------|
| **Mode Histoire** | 3 actes avec dialogues, combats et fin (voir ci-dessous) |
| **Combat** | Adèle contre Héloïse (bot), 90 secondes. Victoire par K.-O. ou aux points de vie |
| **Survie** | Vue du dessus, vagues d'ennemis infinies qui deviennent plus nombreuses, plus rapides et plus résistantes |

Chaque combat et chaque partie de survie démarre par un compte à rebours **3, 2, 1, FIGHT !** : les personnages, le chronomètre et les vagues attendent la fin du décompte.

### Mode Histoire

1. **Acte I — Le combat forcé** : combat d'arène contre Héloïse (qui se retient) pendant 45 secondes. Il faut tenir sans qu'aucune des deux sœurs ne soit K.-O.
2. **Acte II — Le spectacle doit continuer** : shooter en vue du dessus, 3 vagues (8, 12 puis 16 ennemis). Héloïse suit Adèle et tire automatiquement. Si une sœur tombe, c'est perdu.
3. **Acte III — Le dernier combat** : boss final, le père (250 PV, 3 phases selon sa santé, de plus en plus rapide et agressif). Héloïse combat aux côtés d'Adèle, sans chronomètre.

Les dialogues ont des voix synthétisées propres à chaque personnage (Web Audio), et des répliques apparaissent pendant les combats. En cas de défaite, un écran « Game Over » propose de **rejouer l'étape** ou de revenir au menu.

## Commandes

### Combat et Histoire (actes I et III)

| Action | Clavier | Mobile |
|--------|---------|--------|
| Se déplacer | `←` `→` | Joystick gauche |
| Sauter / s'accroupir | `↑` / `↓` | Joystick gauche |
| Coup de poing | `A` | Bouton POING |
| Coup de pied | `Z` | Bouton PIED |
| Attaque spéciale (recharge 3 s) | `E` | Bouton SPÉ |
| Dash (recharge 1 s) | `Q` | Bouton DASH |

### Survie et acte II

| Action | Clavier / souris | Mobile |
|--------|------------------|--------|
| Se déplacer | Flèches ou `Z` `Q` `S` `D` | Joystick gauche |
| Viser | Souris | Joystick droit |
| Tirer | Clic ou `ESPACE` | Joystick droit (tir continu) |

### Dialogues

`ESPACE`, `ENTRÉE` ou clic : réplique suivante. `ÉCHAP` ou bouton **PASSER** : passer la scène.

## Mobile et plein écran

- Les contrôles tactiles (joysticks flottants et boutons) apparaissent automatiquement sur appareil tactile. Ajouter `?touch` à l'URL les active aussi sur ordinateur pour tester.
- Le jeu occupe tout l'écran. Un bouton ⛶ en haut à droite bascule en **plein écran** (API Fullscreen) et tente de verrouiller le mode paysage. Il est masqué quand le navigateur ne le permet pas (Safari sur iPhone).

## Audio

| Usage | Fichier |
|-------|---------|
| Menu et victoire | `OmbreFeu.wav` |
| Combat et survie | `fightSong.mp3` |
| Boss (acte III) | `bossSong.mp3` |
| Intro de l'acte I | `Affronte le Boss.mp3` + ambiance d'arène (volume réduit) |
| Game Over | `SadOmbreFeu.mp3` |

Les ambiances (public, huées) sont des effets sonores en boucle jouées pendant les dialogues. Les bruitages de coups et l'explosion du mode Survie sont des fichiers `.wav` ou synthétisés.

## Lancer le projet

Les modules ES nécessitent un serveur HTTP (pas de `file://`).

```bash
npm start            # http-server . -o
# ou
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`. Phaser 3.55.2 est chargé depuis un CDN.

## Structure

```
index.html              page + bouton plein écran
src/
  main.js               configuration Phaser et liste des scènes
  scenes/
    BootScene, PreloadScene   chargement des assets et animations
    MenuScene                 menu et écran des contrôles
    GameScene + HudScene      combat d'arène (Combat, actes I et III) et interface
    ShooterScene              Survie et acte II
    DialogueScene             dialogues de l'histoire
    StoryEndScene             générique de fin
    GameOver, GameWin         écrans de fin
  entities/
    Fighter                   base commune (vie, états, dégâts)
    Player (Adèle), Bot (Héloïse), Boss (le père, 3 phases)
  story/storyScript.js        scénario : étapes, dialogues, répliques de combat
  ui/                         HealthBar, Barks, DialogueVoice, TouchControls, Countdown
assets/
  audio/music, audio/sound    musiques et bruitages
  sprites                     spritesheets des personnages, décors
```

### Scénario

`src/story/storyScript.js` décrit l'histoire sous forme d'étapes enchaînées (`dialogue`, `arena`, `shooter`, `end`). Une étape de dialogue peut définir `ambience` (son d'ambiance), `ambienceVolume`, `music` (musique de fond), un `title` et un `hint` affiché au début.

## Suite prévue

Voir [`Todo.txt`](Todo.txt) : explosions en spritesheet en mode Survie, boules de feu, icônes de visage dans les dialogues, meilleures collisions (recul, protection), sélection de personnage avec le père à débloquer, score et sauvegarde.

Licences des assets : [`assets/licenceTheTwinClash.txt`](assets/licenceTheTwinClash.txt).
