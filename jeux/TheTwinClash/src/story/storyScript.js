// Script du mode Histoire de The Twin Clash — version plus courte et humoristique.
// Sœur A = Adèle (personnage joué), Sœur B = Héloïse (sœur contrôlée par l'IA).

export const NAMES = { A: 'ADÈLE', B: 'HÉLOÏSE', P: 'PÈRE', PR: 'PRÉSENTATEUR' };
export const COLORS = { A: '#6ec1ff', B: '#ff8fd0', P: '#ff6b5e', PR: '#ffd166', N: '#c8c8c8' };

const L = (who, text) => ({ who, text });

// Répliques courtes déclenchées pendant les combats.
export const BARKS = {
  act1: [
    { at: 2500, lines: [
      L('B', "Essaie de ne pas me casser le nez."),
      L('A', "Promis. Je vise le reste.")
    ] },
    { at: 20000, lines: [
      L('B', "C'est bientôt fini ? J'ai faim."),
      L('A', "Survis d'abord. Le goûter après.")
    ] }
  ],
  act2: [
    [
      L('A', "À gauche !"),
      L('B', "Je sais, j'ai des yeux !"),
      L('A', "Alors utilise-les !")
    ],
    [
      L('B', "Ils sont combien ?"),
      L('A', "Trop pour un repas de famille."),
      L('B', "Et pas un qui a apporté une pizza.")
    ],
    [
      L('B', "Dernière vague !"),
      L('A', "Après, on se tire."),
      L('B', "Et on change de famille ?")
    ]
  ],
  act2LowB: [
    L('A', "Héloïse, ça va ?"),
    L('B', "Oui. Mon ego a pris le plus gros coup."),
    L('A', "Parfait, il était déjà énorme.")
  ],
  act2LowA: [
    L('B', "À mon tour de te protéger. Essaie de ne pas faire ta tête de héros.")
  ],
  act3: {
    1: [
      L('P', "Je vous ai appris à frapper !"),
      L('A', "Oui. Mais pas à écouter."),
      L('B', "Attention, papa prépare son discours. Ça va durer plus longtemps que le combat.")
    ],
    2: [
      L('P', "Arrêtez de bouger !"),
      L('B', "C'est un combat, pas une photo de famille."),
      L('A', "Et on ne travaille plus pour toi !"),
      L('P', "Ingrates !"),
      L('B', "On a hérité de ton caractère. C'est déjà beaucoup.")
    ],
    3: [
      L('P', "Vous ne pouvez pas me laisser ! Je suis votre père !"),
      L('A', "Tu aurais pu commencer par agir comme tel."),
      L('B', "On t'enverra une carte pour la fête des pères. Peut-être."),
      L('P', "Sans moi, vous n'êtes rien !"),
      L('A', "On est deux. Ça fait déjà beaucoup de problèmes pour toi.")
    ]
  }
};

// Enchaînement des étapes : dialogue, combat d'arène, shooter, fin.
export const STEPS = {
  act1_intro: {
    type: 'dialogue',
    ambience: 'ambArena',
    ambienceVolume: 0.15,
    music: 'bgmAffronteBoss',
    title: 'ACTE I — Le combat forcé',
    hint: "Objectif : tenir jusqu'à la fin du chronomètre sans qu'aucune sœur ne soit K.-O.",
    lines: [
      L('N', "Dans les coulisses, les jumelles attendent. Leur père jette deux paires de gants à leurs pieds."),
      L('P', "Debout. C'est votre tour."),
      L('A', "J'ai encore mal aux côtes."),
      L('P', "La foule a payé. Elle veut un spectacle."),
      L('B', "Et un remboursement, si on refuse ?"),
      L('P', "Dans cette famille, on fait ce que je dis !"),
      L('A', "C'est pratique. Tu n'as jamais besoin d'avoir raison."),
      L('N', "Il ouvre la porte de l'arène. La foule rugit."),
      L('B', "Reste près de moi."),
      L('A', "Toujours. Mais si tu me marches sur le pied, c'est fini."),
      L('PR', "Mesdames et messieurs, accueillez les sœurs ! Elles sont rapides, féroces et… probablement pas payées assez !"),
      L('P', "Montrez-leur ce que je vous ai appris !"),
      L('B', "On peut lui montrer aussi comment on claque une porte ?")
    ],
    next: 'act1_fight'
  },

  act1_fight: { type: 'arena', act: 1, next: 'act1_end' },

  act1_end: {
    type: 'dialogue',
    ambience: 'ambBoo',
    title: 'ACTE I — Fin',
    lines: [
      L('N', "La cloche sonne. Les deux sœurs sont épuisées, mais debout."),
      L('P', "Vous vous êtes retenues ! Vous m'avez fait honte !"),
      L('A', "On a suivi tes consignes. Il fallait être plus précis."),
      L('B', "Et on refuse de se battre l'une contre l'autre."),
      L('P', "Alors battez-vous contre mes hommes !"),
      L('N', "Des combattants entrent dans l'arène et bloquent les sorties."),
      L('A', "Reste derrière moi."),
      L('B', "Non. Côte à côte. C'est plus simple pour les coups de pied."),
      L('N', "La caméra se rapproche des jumelles. Le style de jeu change.")
    ],
    next: 'act2_intro'
  },

  act2_intro: {
    type: 'dialogue',
    ambience: 'ambBoo',
    title: 'ACTE II — Le spectacle doit continuer',
    hint: "Objectif : survivre aux 3 vagues. Si une sœur tombe, c'est perdu.",
    lines: [
      L('N', "Le père s'avance devant le public, les bras grands ouverts."),
      L('P', "Vous vouliez du spectacle ? Mes meilleurs hommes vont vous arrêter !"),
      L('B', "Ils ont signé une décharge ?"),
      L('P', "Ils font ce que je leur paie pour faire !"),
      L('A', "Alors tu devrais demander un remboursement."),
      L('P', "Vous ne seriez rien sans moi !"),
      L('B', "Et toi, tu serais au chômage sans nous."),
      L('N', "Les hommes attaquent. La caméra passe en vue du dessus.")
    ],
    next: 'act2_fight'
  },

  act2_fight: { type: 'shooter', next: 'act2_end' },

  act2_end: {
    type: 'dialogue',
    ambience: 'ambBoo',
    title: 'ACTE II — Fin',
    lines: [
      L('N', "Le dernier homme tombe. Les jumelles se dirigent vers la sortie, mais leur père leur barre le chemin."),
      L('P', "Ça suffit !"),
      L('A', "Pousse-toi."),
      L('P', "Vous allez détruire tout ce que j'ai construit ?"),
      L('B', "Tu as surtout construit une très mauvaise ambiance."),
      L('P', "Je vous ai rendues fortes !"),
      L('A', "Oui. Et très motivées pour partir."),
      L('N', "Le père retire sa veste et se place au centre de l'arène."),
      L('P', "Si personne ne peut vous arrêter, je le ferai moi-même !"),
      L('B', "Il va vraiment se battre en veste ?"),
      L('A', "Concentre-toi. On lui enlèvera après."),
      L('N', "La caméra revient à la vue de combat. Le combat final commence.")
    ],
    next: 'act3_intro'
  },

  act3_intro: {
    type: 'dialogue',
    ambience: 'ambBoo',
    title: 'ACTE III — Le dernier combat',
    hint: "Héloïse vous aide.\nObjectif : vaincre le père. Si les deux sœurs sont K.-O., c'est perdu.",
    lines: [
      L('N', "Le père tourne autour des jumelles. Elles connaissent chacune de ses techniques."),
      L('P', "Je vous ai appris chaque coup, chaque esquive, chaque faiblesse !"),
      L('A', "Tu as oublié le plus important."),
      L('P', "Quoi donc ?"),
      L('B', "Ne jamais sous-estimer deux sœurs qui ont grandi ensemble."),
      L('P', "Sans moi, vous n'êtes rien !"),
      L('A', "On est deux. Et on est très énervées."),
      L('B', "Allez, papa. Essaie de suivre. On sait que tu n'es plus tout jeune.")
    ],
    next: 'act3_fight'
  },

  act3_fight: { type: 'arena', act: 3, next: 'final' },

  final: {
    type: 'dialogue',
    title: 'Libres, enfin',
    lines: [
      L('N', "Le père tombe à genoux. Pour la première fois, il n'a plus d'ordre à donner."),
      L('P', "Attendez… Vous êtes mes filles !"),
      L('A', "Exact. Pas tes employées."),
      L('B', "Et on démissionne sans préavis."),
      L('N', "Les jumelles se regardent. La tension retombe enfin."),
      L('B', "C'est vraiment fini ?"),
      L('A', "Oui. Plus personne ne nous forcera à nous battre."),
      L('B', "Alors, on fait quoi maintenant ?"),
      L('A', "On mange. J'ai combattu trois vagues avec l'estomac vide."),
      L('B', "Enfin une stratégie qui me plaît."),
      L('N', "Elles se prennent dans les bras, puis marchent main dans la main vers la sortie. Cette fois, elles ne se retournent pas.")
    ],
    next: 'end'
  },

  end: { type: 'end' }
};

export const FIRST_STEP = 'act1_intro';

// Scène + données à lancer pour une étape (sert aussi au bouton « Réessayer »).
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
