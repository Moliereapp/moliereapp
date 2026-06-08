export type Mot = {
  id: number
  mot: string
  nature: string
  theme: string
  definition: string
  etymologie: string
  exemples: { texte: string; contexte: string }[]
  quiz: { correct: string; wrongs: string[]; anecdote: string }
}

export const MOTS: Mot[] = [
  {
    id: 1,
    mot: "Palimpseste",
    nature: "nom masculin",
    theme: "Littérature",
    definition: "Parchemin ou manuscrit dont on a effacé l'écriture pour pouvoir y écrire un nouveau texte, mais dont les traces originales restent partiellement visibles.",
    etymologie: "Du grec palímpsestos — « gratté de nouveau »",
    exemples: [
      { texte: "Cette ville est un palimpseste vivant : sous chaque façade haussmannienne affleurent des traces médiévales.", contexte: "Usage figuré — architecture & mémoire" },
      { texte: "Sa mémoire était un palimpseste : les souvenirs d'enfance transparaissaient sous les années.", contexte: "Métaphore poétique" },
      { texte: "L'archéologue étudia avec soin le palimpseste découvert dans le monastère.", contexte: "Contexte historique & scientifique" }
    ],
    quiz: {
      correct: "Parchemin dont on a effacé l'écriture pour y écrire un nouveau texte, l'original restant visible.",
      wrongs: [
        "Ornement architectural antique placé au sommet d'une colonne.",
        "Technique picturale utilisant des couches de cire translucide.",
        "Instrument de musique à cordes pincées de la Renaissance."
      ],
      anecdote: "Un palimpseste révèle les traces du passé sous le présent — une belle métaphore pour la mémoire !"
    }
  },
  {
    id: 2,
    mot: "Volubile",
    nature: "adjectif",
    theme: "Vie quotidienne",
    definition: "Qui parle avec abondance, facilité et rapidité, sans s'arrêter.",
    etymologie: "Du latin volubilis — « qui tourne facilement »",
    exemples: [
      { texte: "Sa voisine, volubile comme toujours, lui raconta l'incident en détail.", contexte: "Usage courant" },
      { texte: "L'avocat volubile captivait le jury avec ses plaidoiries fleuries.", contexte: "Contexte professionnel" },
      { texte: "Nerveux, il devenait volubile et ne laissait personne placer un mot.", contexte: "État émotionnel" }
    ],
    quiz: {
      correct: "Qui parle beaucoup, avec rapidité et abondance.",
      wrongs: [
        "Qui se déplace sans bruit, de manière furtive.",
        "Qui change facilement d'opinion selon les circonstances.",
        "Qui présente une surface lisse et brillante."
      ],
      anecdote: "Volubile vient du latin volvere — les mots s'y enroulent en flots continus."
    }
  },
  {
    id: 3,
    mot: "Acrimonie",
    nature: "nom féminin",
    theme: "Philosophie",
    definition: "Caractère âpre, mordant et agressif dans les propos ou le comportement d'une personne.",
    etymologie: "Du latin acrimonia — « âcreté, mordant »",
    exemples: [
      { texte: "Le débat tourna à l'acrimonie dès que la politique fut abordée.", contexte: "Contexte social" },
      { texte: "Elle répondit avec une acrimonie qui surprit tout le monde.", contexte: "Relation interpersonnelle" },
      { texte: "L'acrimonie de ses critiques décourageait les jeunes auteurs.", contexte: "Milieu littéraire" }
    ],
    quiz: {
      correct: "Amertume ou aigreur marquée dans les paroles ou le comportement.",
      wrongs: [
        "Douceur extrême dans la manière de s'exprimer.",
        "Substance chimique utilisée en parfumerie orientale.",
        "Sentiment de nostalgie lié à un lieu d'enfance."
      ],
      anecdote: "Un débat acrimonieux est chargé d'hostilité voilée — à éviter en bonne compagnie !"
    }
  },
  {
    id: 4,
    mot: "Léthargique",
    nature: "adjectif",
    theme: "Sciences",
    definition: "Qui est dans un état de torpeur profonde, caractérisé par un manque d'énergie, de réactivité ou d'intérêt pour ce qui l'entoure.",
    etymologie: "Du grec lêthê — « oubli », le fleuve des Enfers qui effaçait les souvenirs",
    exemples: [
      { texte: "Après le repas copieux, il resta léthargique sur le canapé toute l'après-midi.", contexte: "Usage courant" },
      { texte: "L'économie léthargique du pays inquiétait les investisseurs.", contexte: "Contexte économique" },
      { texte: "La chaleur estivale rendait les élèves léthargiques et inattentifs.", contexte: "Contexte scolaire" }
    ],
    quiz: {
      correct: "Qui est dans un état de torpeur profonde, manquant d'énergie ou de réactivité.",
      wrongs: [
        "Qui fait preuve d'une curiosité débordante et d'enthousiasme.",
        "Qui souffre d'une hypersensibilité aux stimuli lumineux.",
        "Relatif à une mémoire exceptionnellement précise."
      ],
      anecdote: "La léthargie vient du grec lêthê — le fleuve de l'oubli aux Enfers."
    }
  },
  {
    id: 5,
    mot: "Immuable",
    nature: "adjectif",
    theme: "Philosophie",
    definition: "Qui ne change pas, qui reste identique à lui-même à travers le temps, quelles que soient les circonstances.",
    etymologie: "Du latin immutabilis — « qui ne peut être changé »",
    exemples: [
      { texte: "Les lois de la physique semblent immuables à l'échelle humaine.", contexte: "Contexte scientifique" },
      { texte: "Son sourire immuable cachait une profonde mélancolie.", contexte: "Description d'un personnage" },
      { texte: "Le rituel du thé du soir était immuable depuis quarante ans.", contexte: "Habitude quotidienne" }
    ],
    quiz: {
      correct: "Qui ne change pas, qui reste identique à travers le temps.",
      wrongs: [
        "Qui se transforme constamment selon les saisons.",
        "Qui est imperméable à l'eau et aux intempéries.",
        "Qui ne peut être mesuré avec précision."
      ],
      anecdote: "Le philosophe Héraclite affirmait qu'on ne se baigne jamais deux fois dans le même fleuve — l'immuable est donc une illusion pour lui !"
    }
  }
]

export function getMotDuJour(): Mot {
  const debut = new Date('2024-01-01').getTime()
  const maintenant = new Date().getTime()
  const joursEcoules = Math.floor((maintenant - debut) / (1000 * 60 * 60 * 24))
  return MOTS[joursEcoules % MOTS.length]
}
