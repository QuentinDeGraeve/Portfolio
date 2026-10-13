# Plan â€“ FaceToFace (quiz Phaser HÃ©loÃ¯se ou AdÃ¨le ?)

## Vue d'ensemble

CrÃ©er dans `jeux/FaceToFace/` (dossier actuellement vide) un jeu Phaser 3 de quiz : 10 photos affichÃ©es une Ã  une, le joueur choisit Â« HÃ©loÃ¯se Â» ou Â« AdÃ¨le Â». Score final sur 10 : **â‰¥ 7 = GagnÃ©, sinon Perdu**.

DÃ©cisions validÃ©es avec l'utilisateur :
- 10 photos diffÃ©rentes (une par question), **ordre alÃ©atoire Ã  chaque partie**.
- Photos fournies par l'utilisateur dans `assets/photos/photo01.jpg â€¦ photo10.jpg`.
- `menu.png`, `bg.png` et les musiques sont copiÃ©s par l'utilisateur dans `FaceToFace/assets/` ; le jeu doit fonctionner avec un repli (placeholder / pas de son) s'ils sont absents.
- ThÃ¨me repris de `jeux/TheTwinsClash` : 960x540, `Phaser.Scale.FIT`, fond `#10121a`, Phaser 3.55.2 via CDN jsDelivr, scÃ¨nes ES modules, textes Arial gras avec contour noir, musique OmbreFeu (menu + quiz) et SadOmbreFeu (rÃ©sultat).
- Boutons : HÃ©loÃ¯se (violet/rose), AdÃ¨le (bleu) ; feedback vert (bonne rÃ©ponse) / rouge (mauvaise), puis question suivante.

Flux des scÃ¨nes : Boot â†’ Preload â†’ Menu â†’ Quiz â†’ Result (GagnÃ© / Perdu).

Structure cible :
```
jeux/FaceToFace/
  index.html
  src/main.js
  src/data/questions.js
  src/scenes/{BootScene,PreloadScene,MenuScene,QuizScene,ResultScene}.js
  assets/photos/            (photo01..10.jpg fournies par l'utilisateur)
  assets/sprites/images/    (menu.png, bg.png copiÃ©s par l'utilisateur)
  assets/audio/music/       (OmbreFeu.wav, SadOmbreFeu.mp3 copiÃ©s par l'utilisateur)
```

---

## Sub-task 1 â€“ Squelette du projet

- **Intent** : disposer d'une page qui lance Phaser avec la mÃªme configuration que TheTwinsClash.
- **Expected Outcomes** : ouvrir `index.html` (via serveur local) affiche un canvas 960x540 sur fond `#10121a`, centrÃ©, sans erreur bloquante.
- **Todo List** :
  1. CrÃ©er `index.html` sur le modÃ¨le de celui de TheTwinsClash (titre Â« Face To Face Â», CDN Phaser 3.55.2, `#game-container`, script module `./src/main.js`).
  2. CrÃ©er `src/main.js` avec la config (960x540, FIT, CENTER_BOTH, `backgroundColor '#10121a'`, sans physique) et la liste des scÃ¨nes.
  3. CrÃ©er `BootScene.js` (passe Ã  `Preload`) en reprenant le pattern de TheTwinsClash.
- **Relevant Context** : [`jeux/TheTwinsClash/index.html`](jeux/TheTwinsClash/index.html), [`jeux/TheTwinsClash/src/main.js`](jeux/TheTwinsClash/src/main.js), [`jeux/TheTwinsClash/src/scenes/BootScene.js`](jeux/TheTwinsClash/src/scenes/BootScene.js).
- **Status** : [x] done

## Sub-task 2 â€“ DonnÃ©es des questions et chargement des assets

- **Intent** : centraliser la dÃ©finition des 10 questions et charger les assets de faÃ§on tolÃ©rante.
- **Expected Outcomes** : `questions.js` exporte 10 entrÃ©es `{ key, file, answer }` oÃ¹ `answer` vaut `'heloise'` ou `'adele'` ; PreloadScene charge photos, `menu`, `bg` et musiques sans planter si un fichier est absent.
- **Todo List** :
  1. CrÃ©er `src/data/questions.js` avec 10 entrÃ©es `photo01..photo10` ; la bonne rÃ©ponse est un placeholder Ã  renseigner par l'utilisateur (commentaire clair en tÃªte de fichier).
  2. CrÃ©er `PreloadScene.js` : texte Â« Chargement... Â», chargement des 10 photos, `menu.png`, `bg.png`, `OmbreFeu.wav`, `SadOmbreFeu.mp3` ; ignorer les erreurs de chargement (Ã©couter `loaderror`) pour ne pas bloquer.
  3. Passer Ã  `Menu` dans `create()`.
- **Relevant Context** : [`jeux/TheTwinsClash/src/scenes/PreloadScene.js`](jeux/TheTwinsClash/src/scenes/PreloadScene.js) (clÃ©s `bg`, `menu`, `bgmMenu`, `bgmGameOver`, `bgmGameWin`).
- **Status** : [x] done

## Sub-task 3 â€“ Menu

- **Intent** : Ã©cran d'accueil au thÃ¨me TheTwinsClash.
- **Expected Outcomes** : fond `menu` (ou fond uni `#10121a` si absent), titre Â« FACE TO FACE Â», rÃ¨gle (Â« 10 photos â€“ 7/10 pour gagner Â»), bouton JOUER dÃ©marrant le quiz ; musique de menu en boucle si disponible.
- **Todo List** :
  1. CrÃ©er `MenuScene.js` : image de fond redimensionnÃ©e Ã  960x540 si prÃ©sente, titre 48px gras avec contour noir, sous-titre explicatif.
  2. Bouton JOUER (rectangle interactif avec survol, contour blanc, comme le menu existant) â†’ arrÃªte/conserve la musique puis `scene.start('Quiz')`.
  3. Lancer la musique OmbreFeu en boucle uniquement si l'audio est dans le cache.
- **Relevant Context** : [`jeux/TheTwinsClash/src/scenes/MenuScene.js`](jeux/TheTwinsClash/src/scenes/MenuScene.js) (style des boutons, couleurs de survol).
- **Status** : [x] done

## Sub-task 4 â€“ ScÃ¨ne Quiz

- **Intent** : cÅ“ur du jeu : 10 questions, photo alÃ©atoire, boutons de rÃ©ponse, score.
- **Expected Outcomes** : Ã  chaque partie les 10 questions sont mÃ©langÃ©es ; une photo centrÃ©e est affichÃ©e avec Â« Question n/10 Â» et le score courant ; deux boutons HÃ©loÃ¯se / AdÃ¨le ; aprÃ¨s clic, feedback vert/rouge (bonne rÃ©ponse rÃ©vÃ©lÃ©e), boutons dÃ©sactivÃ©s, passage automatique (court dÃ©lai) Ã  la question suivante ; aprÃ¨s la 10áµ‰, envoi du score Ã  `Result`.
- **Todo List** :
  1. MÃ©langer une copie du tableau de questions (Fisher-Yates) au `create()`.
  2. Afficher fond `bg` (ou fond uni), l'en-tÃªte (numÃ©ro de question, score) et la photo adaptÃ©e Ã  une zone fixe en conservant le ratio ; si la texture est absente, dessiner un rectangle placeholder avec le texte Â« photoXX manquante Â».
  3. CrÃ©er les boutons HÃ©loÃ¯se (violet/rose) et AdÃ¨le (bleu) avec survol ; au clic comparer Ã  `answer`, incrÃ©menter le score, colorer le bouton choisi (vert si correct, rouge sinon) et surligner la bonne rÃ©ponse.
  4. Verrouiller les entrÃ©es pendant le dÃ©lai, puis charger la question suivante (ou `scene.start('Result', { score, total: 10 })`).
  5. Musique OmbreFeu en boucle pendant le quiz si disponible (sans doubler celle du menu).
- **Relevant Context** : `src/data/questions.js` (sous-tÃ¢che 2) ; pattern d'UI de `MenuScene` ; HUD texte avec contour noir de [`jeux/TheTwinsClash/src/scenes/HudScene.js`](jeux/TheTwinsClash/src/scenes/HudScene.js).
- **Status** : [x] done

## Sub-task 5 â€“ ScÃ¨ne RÃ©sultat

- **Intent** : afficher le score et l'issue de la partie.
- **Expected Outcomes** : Â« Score : X/10 Â» ; si X â‰¥ 7 Â« GAGNÃ‰ ! Â» en `#44ff88`, sinon Â« PERDU... Â» en `#ff4444` ; possibilitÃ© de rejouer (nouvel ordre alÃ©atoire) ou de retourner au menu ; musique SadOmbreFeu si disponible.
- **Todo List** :
  1. CrÃ©er `ResultScene.js` lisant `data.score` et `data.total`, seuil de victoire en constante (7).
  2. Afficher titre 48px, score, message, et deux actions (touche R / bouton REJOUER â†’ `Quiz`, touche ESPACE / bouton MENU â†’ `Menu`) en s'inspirant de GameWin/GameOver.
  3. ArrÃªter les sons au changement de scÃ¨ne.
- **Relevant Context** : [`jeux/TheTwinsClash/src/scenes/GameWin.js`](jeux/TheTwinsClash/src/scenes/GameWin.js), [`jeux/TheTwinsClash/src/scenes/GameOver.js`](jeux/TheTwinsClash/src/scenes/GameOver.js).
- **Status** : [x] done

## Sub-task 6 â€“ Dossiers d'assets, doc et vÃ©rification

- **Intent** : rendre le jeu prÃªt Ã  recevoir les ressources de l'utilisateur et vÃ©rifier le flux complet.
- **Expected Outcomes** : emplacements d'assets documentÃ©s ; flux Menu â†’ Quiz â†’ Result testÃ© avec et sans assets.
- **Todo List** :
  1. Ajouter un `README.md` court listant les fichiers Ã  dÃ©poser (`assets/photos/photo01..10.jpg`, `assets/sprites/images/menu.png` et `bg.png`, `assets/audio/music/OmbreFeu.wav` et `SadOmbreFeu.mp3`) et comment renseigner `answer` dans `questions.js`.
  2. VÃ©rifier les chemins relatifs d'import (modules ES) et l'absence d'erreur console avec assets manquants.
  3. Servir le dossier en local et parcourir une partie complÃ¨te (score â‰¥ 7 et < 7).
- **Relevant Context** : [`jeux/TheTwinsClash/README.md`](jeux/TheTwinsClash/README.md) pour le ton ; les dossiers d'assets seront crÃ©Ã©s au dÃ©pÃ´t des fichiers par l'utilisateur.
- **Status** : [x] done

---

## Points d'attention
- Les modules ES nÃ©cessitent un serveur HTTP local (pas `file://`), comme TheTwinsClash.
- Les bonnes rÃ©ponses (`answer`) ne peuvent pas Ãªtre devinÃ©es : l'utilisateur doit les confirmer pour chaque photo.
- Note : `git status` montre `jeux/TheTwinClash/` supprimÃ© et `jeux/TheTwinsClash/` non suivi (renommage en cours) ; sans impact sur ce plan.

