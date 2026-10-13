# Face To Face

Quiz Phaser : 10 photos (ordre aléatoire), choisir **Héloïse** ou **Adèle**. Il faut **7/10** pour gagner.

## Fichiers à déposer (optionnels : le jeu fonctionne sans, avec des placeholders)

- `assets/photos/photo01.jpg` … `photo10.jpg`
- `assets/sprites/images/menu.png` et `bg.png` (copiés de TheTwinsClash)
- `assets/audio/music/OmbreFeu.wav` et `SadOmbreFeu.mp3` (copiés de TheTwinsClash)

## Bonnes réponses

Éditer `src/data/questions.js` : pour chaque photo, `answer` vaut `'heloise'` ou `'adele'`.
Les valeurs actuelles sont des exemples à remplacer.

## Lancer

Servir le dossier en HTTP (modules ES), par exemple : `npx http-server jeux/FaceToFace` puis ouvrir la page.
