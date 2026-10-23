// Génère src/data/photos.js à partir du contenu des dossiers assets/photos/heloise et assets/photos/adele.
// Usage (depuis la racine du dépôt) : node jeux/FaceToFace/scripts/generate-photos.mjs
//
// Descriptions facultatives : assets/photos/descriptions.json, ex. { "adele/photo01.jpg": "7 mois" }
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const photosDir = join(root, 'assets', 'photos');
const outFile = join(root, 'src', 'data', 'photos.js');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
// Nom du dossier = bonne réponse
const FOLDERS = ['heloise', 'adele'];

const descFile = join(photosDir, 'descriptions.json');
const descriptions = existsSync(descFile) ? JSON.parse(readFileSync(descFile, 'utf8')) : {};

const photos = [];
for (const answer of FOLDERS) {
  const dir = join(photosDir, answer);
  if (!existsSync(dir)) continue;
  readdirSync(dir)
    .filter(name => EXTENSIONS.has(extname(name).toLowerCase()))
    .sort()
    .forEach(name => {
      const file = `${answer}/${name}`;
      const photo = { file, answer };
      if (descriptions[file]) photo.description = descriptions[file];
      photos.push(photo);
    });
}

const content = `// FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Régénérer avec : node jeux/FaceToFace/scripts/generate-photos.mjs
export const PHOTOS = ${JSON.stringify(photos, null, 2)};
`;
writeFileSync(outFile, content);
console.log(`${photos.length} photo(s) : ` + FOLDERS.map(f => `${f} ${photos.filter(p => p.answer === f).length}`).join(', '));
