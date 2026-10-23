# Face To Face

Quiz Phaser : 10 photos (ordre aléatoire), choisir **Héloïse** ou **Adèle**. Il faut **7/10** pour gagner.

## Ajouter des photos

Déposer les images (`.jpg`, `.jpeg`, `.png`, `.webp`) dans :

- `assets/photos/heloise/` : photos d'Héloïse
- `assets/photos/adele/` : photos d'Adèle

Le nom du dossier donne la bonne réponse. Puis, depuis la racine du dépôt, régénérer la liste :

```
node jeux/FaceToFace/scripts/generate-photos.mjs
```

Cela réécrit `src/data/photos.js` (fichier généré, à ne pas modifier à la main). Les noms de fichiers sont libres.

Texte affiché sous une photo (facultatif) : `assets/photos/descriptions.json`, par ex. `{ "adele/photo01.jpg": "7 mois" }`.

## Autres fichiers

- Images : `assets/sprites/images/` (`menu.jpg`, `bg.jpg`, `bg2.jpg`)
- Musiques : `assets/audio/music/` (`music_menu.mp3`, `music_game.mp3`, `music_fin.mp3`)
- Effets : `assets/audio/effect/good` et `bad` ; vidéos de fin : `assets/video/`

## Lancer

Servir le dossier en HTTP (modules ES), par exemple : `npx http-server jeux/FaceToFace` puis ouvrir la page.
