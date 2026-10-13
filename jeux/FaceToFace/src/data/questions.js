// Une entrée par photo : assets/photos/<file>
// answer      : 'heloise' ou 'adele' -> À RENSEIGNER selon la personne présente sur chaque photo.
// description : (optionnel) petit texte affiché sous la photo, ex. l'âge ou l'événement.
export const QUESTIONS = [
  { key: 'photo01', file: 'adele/photo01.jpg', answer: 'adele', description: '7 mois' },
  { key: 'photo02', file: 'adele/photo02.jpg', answer: 'adele',   description: '10 mois' },
  { key: 'photo03', file: 'adele/photo03.jpg', answer: 'adele', description: 'test' },
  { key: 'photo04', file: 'adele/photo04.jpg', answer: 'adele',   description: 'test' },
  { key: 'photo05', file: 'adele/photo05.jpg', answer: 'adele', description: 'test' },
  { key: 'photo06', file: 'adele/photo06.jpg', answer: 'adele',   description: 'test' },
  { key: 'photo07', file: 'adele/photo07.jpg', answer: 'adele', description: 'tesst' },
  { key: 'photo08', file: 'heloise/photo08.jpg', answer: 'heloise',   description: 'test' },
  { key: 'photo09', file: 'heloise/photo09.jpg', answer: 'heloise', description: 'test' },
  { key: 'photo10', file: 'heloise/photo10.jpg', answer: 'heloise', description: 'tesst' },
  { key: 'photo11', file: 'heloise/photo11.jpg', answer: 'heloise',   description: 'test' },
  { key: 'photo12', file: 'heloise/photo12.jpg', answer: 'heloise', description: 'test' },
  { key: 'photo13', file: 'heloise/photo13.jpg', answer: 'heloise',   description: 'tes' },
  { key: 'photo14', file: 'heloise/photo14.jpg', answer: 'heloise',   description: 'tes' }
];

// Nombre de questions par partie : tirées au hasard parmi toutes les photos ci-dessus.
// Chaque 'key' doit être unique.
export const QUESTION_COUNT = 10;

export const WIN_SCORE = 7;
