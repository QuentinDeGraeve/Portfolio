// Les photos viennent de src/data/photos.js, généré automatiquement depuis les dossiers
// assets/photos/heloise et assets/photos/adele (le nom du dossier = la bonne réponse).
// Voir scripts/generate-photos.mjs.
import { PHOTOS } from './photos.js';

// 'key' = identifiant Phaser unique, dérivé du chemin du fichier.
export const QUESTIONS = PHOTOS.map(p => ({ ...p, key: `photo_${p.file}` }));

// Nombre de questions par partie : tirées au hasard parmi toutes les photos.
export const QUESTION_COUNT = 10;

export const WIN_SCORE = 7;
