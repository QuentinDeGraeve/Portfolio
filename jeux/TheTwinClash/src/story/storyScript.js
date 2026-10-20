// Script du mode Histoire de The Twin Clash.
// Source : The_Twin_Clash_Mode_Histoire_Dialogues.md
//
// Les prénoms définitifs des jumelles sont à modifier ici (NAMES).
// Sœur A = Adèle (personnage joué), Sœur B = Héloïse (sœur contrôlée par l'IA).

export const NAMES = { A: 'ADÈLE', B: 'HÉLOÏSE', P: 'PÈRE', PR: 'PRÉSENTATEUR' };
export const COLORS = { A: '#6ec1ff', B: '#ff8fd0', P: '#ff6b5e', PR: '#ffd166', N: '#c8c8c8' };

const L = (who, text) => ({ who, text });

// ---------------------------------------------------------------------------
// Dialogues en cours de combat (déclenchés par des événements)
// ---------------------------------------------------------------------------
export const BARKS = {
  // Acte I : [{ at: ms après le début du combat, lines }]
  act1: [
    { at: 2500, lines: [
      L('B', "Je ne veux pas te faire mal !"),
      L('A', "Alors ne me laisse pas t'en faire. Esquive et tiens bon !")
    ] },
    { at: 20000, lines: [
      L('B', "Combien de temps encore ?"),
      L('A', "Jusqu'à ce que le chronomètre tombe à zéro. Après, on trouvera une solution.")
    ] }
  ],
  // Acte II : une entrée par vague, puis les alertes de santé
  act2: [
    [
      L('A', "Ils arrivent par la gauche !"),
      L('B', "Je les vois. Couvre-moi pendant que je passe !"),
      L('A', "Ne t'éloigne pas trop. On doit rester ensemble !")
    ],
    [
      L('B', "Ils n'arrêtent jamais !"),
      L('A', "Papa ne les laissera pas s'arrêter tant qu'on sera debout."),
      L('B', "Alors on va devoir traverser tout ça."),
      L('A', "On l'a déjà fait, chacune à notre manière. Maintenant, on le fait ensemble.")
    ],
    [
      L('B', "C'est le dernier groupe. Après ça, on sort d'ici."),
      L('A', "Et cette fois, personne ne nous ramènera.")
    ]
  ],
  // Sœur B (Héloïse) en difficulté
  act2LowB: [
    L('A', "Hé ! Tu es touchée ?"),
    L('B', "Ça va… ne t'arrête pas pour moi !"),
    L('A', "Je ne te laisserai pas ici.")
  ],
  // Sœur A (Adèle) en difficulté
  act2LowA: [
    L('B', "C'est à mon tour de te protéger. Reste derrière moi !")
  ],
  // Acte III : une entrée par phase du boss (1, 2, 3)
  act3: {
    1: [
      L('P', "Tu annonces toujours tes coups, comme je te l'ai appris !"),
      L('A', "Et toi, tu répètes toujours les mêmes erreurs."),
      L('B', "À gauche ! Il va enchaîner !")
    ],
    2: [
      L('P', "Arrêtez de bouger et battez-vous !"),
      L('B', "Tu veux qu'on obéisse, même maintenant."),
      L('A', "On ne se bat plus pour toi !"),
      L('P', "INGRATES ! Après tout ce que j'ai fait !"),
      L('B', "Ce que tu as fait ne t'appartient pas. Notre vie nous appartient.")
    ],
    3: [
      L('P', "Vous ne pouvez pas me laisser ici ! Je suis votre père !"),
      L('A', "Tu aurais dû agir comme un père."),
      L('B', "On ne te doit plus notre avenir."),
      L('P', "Sans moi, vous n'avez nulle part où aller !"),
      L('A', "On trouvera notre chemin."),
      L('B', "Ensemble.")
    ]
  }
};

// ---------------------------------------------------------------------------
// Enchaînement des étapes
//   dialogue : scène de dialogue plein écran
//   arena    : combat en arène (GameScene), act 1 ou 3
//   shooter  : shooter vue du dessus (ShooterScene)
//   end      : écran de fin + générique
// ---------------------------------------------------------------------------
export const STEPS = {
  act1_intro: {
    type: 'dialogue',
    ambience: 'ambArena',
    title: 'ACTE I — Le combat forcé',
    hint: 'Flèches : bouger / sauter  |  A : poing  |  Z : pied  |  E : spécial  |  Q : dash\nObjectif : tenir jusqu\'à la fin du chronomètre sans qu\'aucune des deux sœurs ne soit K.-O.',
    lines: [
      L('N', "Une petite pièce derrière l'arène. On entend la foule crier de l'autre côté de la porte. Les deux sœurs attendent, le visage marqué par la fatigue. Leur père entre et jette une paire de gants au sol."),
      L('P', "Debout. C'est votre tour."),
      L('A', "On a déjà combattu hier. J'ai encore mal aux côtes."),
      L('P', "Et alors ? La foule a payé. Elle veut un spectacle."),
      L('B', "On pourrait faire autre chose. On pourrait partir, tous les deux… enfin, tous les trois, et arrêter tout ça."),
      L('P', "Partir ? Avec quel argent ? Qui vous a nourries ? Qui vous a appris à vous battre ?"),
      L('A', "Tu nous as appris à obéir. Ce n'est pas pareil."),
      L('P', "Dans cette famille, on fait ce que je dis. Vous montez dans l'arène et vous tenez jusqu'à la fin. Pas de honte, pas de faiblesse."),
      L('N', "Il ouvre la porte. La lumière de l'arène éclaire les deux sœurs."),
      L('B', "(à voix basse) Comme quand on était petites. Reste près de moi."),
      L('A', "Toujours. On ne se laisse pas tomber."),
      L('N', "Les jumelles entrent dans l'arène. Le présentateur s'adresse au public."),
      L('PR', "Mesdames et messieurs, vous les connaissez ! Elles ont grandi ici, elles ont été entraînées pour ça… Faites du bruit pour les sœurs !"),
      L('N', "Le père observe depuis le bord de l'arène."),
      L('P', "Montrez-leur ce que je vous ai appris !")
    ],
    next: 'act1_fight'
  },

  act1_fight: { type: 'arena', act: 1, next: 'act1_end' },

  act1_end: {
    type: 'dialogue',
    ambience: 'ambBoo',
    title: 'ACTE I — Fin',
    lines: [
      L('N', "La cloche retentit. Les deux sœurs reculent, épuisées, mais toujours debout. Une partie du public hue. Le père frappe la rambarde de rage."),
      L('P', "C'est ça, votre combat ? Vous vous retenez devant tout le monde ?!"),
      L('A', "On a tenu jusqu'à la fin. C'était ton ordre."),
      L('P', "Je vous ai appris à vous battre, pas à vous cacher derrière des règles !"),
      L('B', "On ne veut plus se battre l'une contre l'autre."),
      L('P', "Alors vous allez vous battre contre quelqu'un d'autre."),
      L('N', "Il fait un signe à ses hommes. Plusieurs combattants entrent dans l'arène et bloquent les sorties."),
      L('A', "Reste derrière moi."),
      L('B', "Non. Cette fois, on reste côte à côte."),
      L('N', "La caméra se rapproche des deux sœurs. Le style de jeu change.")
    ],
    next: 'act2_intro'
  },

  act2_intro: {
    type: 'dialogue',
    ambience: 'ambBoo',
    title: 'ACTE II — Le spectacle doit continuer',
    hint: 'Flèches / ZQSD : bouger  |  Souris : viser  |  Clic ou ESPACE : tirer\nObjectif : survivre aux 3 vagues. Si l\'une des sœurs tombe, c\'est perdu.',
    lines: [
      L('N', "Les hommes de main encerclent les jumelles. Le père s'avance devant le public, les bras écartés."),
      L('P', "Vous vouliez du spectacle ? Vous allez en avoir ! Mes filles pensent qu'elles peuvent me défier. Voyons combien de temps elles tiendront contre mes meilleurs hommes !"),
      L('B', "Ce sont tes hommes. Ils vont vraiment nous attaquer ?"),
      L('P', "Ils feront ce que je leur paie pour faire."),
      L('A', "Tu nous as utilisées toute notre vie. Ça s'arrête ce soir."),
      L('P', "Vous ne seriez rien sans moi !"),
      L('B', "Peut-être. Mais on est deux."),
      L('N', "Les hommes attaquent. La caméra passe en vue du dessus et le gameplay de tir commence.")
    ],
    next: 'act2_fight'
  },

  act2_fight: { type: 'shooter', next: 'act2_end' },

  act2_end: {
    type: 'dialogue',
    ambience: 'ambBoo',
    title: 'ACTE II — Fin',
    lines: [
      L('N', "Le dernier homme tombe. Le bruit du combat s'éteint peu à peu. Les jumelles se rapprochent de la sortie, mais leur père descend dans l'arène et leur barre le chemin."),
      L('P', "Ça suffit !"),
      L('A', "C'est terminé. Laisse-nous passer."),
      L('P', "Vous croyez que vous pouvez détruire tout ce que j'ai construit et partir comme ça ?"),
      L('B', "Ce que tu as construit ? Tu nous as enfermées dans cette vie !"),
      L('P', "Je vous ai rendues fortes !"),
      L('A', "Tu nous as appris à encaisser. C'est nous qui avons appris à nous relever."),
      L('N', "Le père retire sa veste et s'avance au centre de l'arène."),
      L('P', "Si personne n'est capable de vous arrêter… je vais le faire moi-même !"),
      L('B', "(à sa sœur) Il nous a appris toutes ses techniques."),
      L('A', "Alors on sait aussi comment les contrer."),
      L('N', "La caméra revient à la vue de combat de l'acte I. La musique change : le combat final commence.")
    ],
    next: 'act3_intro'
  },

  act3_intro: {
    type: 'dialogue',
    ambience: 'ambBoo',
    title: 'ACTE III — Le dernier combat',
    hint: 'Vous contrôlez Adèle (A : poing, Z : pied, E : spécial, Q : dash). Héloïse vous aide.\nObjectif : vaincre le père. Si les deux sœurs sont K.-O., c\'est perdu.',
    lines: [
      L('N', "Le père tourne autour des jumelles, comme lors de leurs entraînements. Il adopte une posture familière. Les sœurs reconnaissent chaque mouvement."),
      L('P', "Je vous ai appris chaque coup. Chaque esquive. Chaque faiblesse."),
      L('A', "Tu nous as appris à nous battre."),
      L('B', "Mais tu ne nous as jamais appris à abandonner l'une l'autre."),
      L('P', "Sans moi, vous n'êtes rien !"),
      L('A', "On n'a plus besoin que tu nous dises qui nous sommes."),
      L('B', "C'est fini. On part ensemble."),
      L('P', "Alors venez ! Montrez-moi ce qu'il vous reste !")
    ],
    next: 'act3_fight'
  },

  act3_fight: { type: 'arena', act: 3, next: 'final' },

  final: {
    type: 'dialogue',
    title: 'Libres, enfin',
    lines: [
      L('N', "Le père tombe à genoux. Les jumelles restent à distance, épuisées. Pour la première fois, il n'a plus la force de leur donner un ordre. Le bruit du public s'éteint."),
      L('P', "(à bout de souffle) Attendez… Vous ne pouvez pas partir. Vous êtes mes filles."),
      L('A', "On l'a toujours été."),
      L('B', "Mais on n'est pas ta propriété."),
      L('N', "Les deux sœurs se regardent. Toute la tension accumulée retombe. Héloïse fait un pas vers sa sœur."),
      L('B', "C'est vraiment fini ?"),
      L('A', "Oui. Plus personne ne nous forcera à nous battre."),
      L('N', "Elles se prennent dans les bras. L'une pleure silencieusement ; l'autre la serre plus fort."),
      L('B', "J'avais peur qu'on ne sorte jamais d'ici."),
      L('A', "Moi aussi. Mais on est encore là. Toutes les deux."),
      L('B', "Qu'est-ce qu'on va faire maintenant ?"),
      L('A', "Pour une fois… ce qu'on veut."),
      L('N', "Elles se détachent, se tiennent par la main et marchent vers la sortie. La lumière du jour apparaît au bout du couloir. Elles franchissent la porte sans se retourner.")
    ],
    next: 'end'
  },

  end: { type: 'end' }
};

export const FIRST_STEP = 'act1_intro';

// Scène + données à lancer pour une étape (sert aussi au "Réessayer" du Game Over)
export function stepTarget(id) {
  const step = STEPS[id];
  switch (step.type) {
    case 'dialogue': return { scene: 'Dialogue', data: { step: id } };
    case 'arena': return { scene: 'Game', data: { story: { step: id, act: step.act } } };
    case 'shooter': return { scene: 'Shooter', data: { story: { step: id } } };
    default: return { scene: 'StoryEnd', data: {} };
  }
}

export function runStep(scene, id) {
  const t = stepTarget(id);
  scene.scene.start(t.scene, t.data);
}
