/* =============================================================
   ESTIVE — Données de la boutique
   -------------------------------------------------------------
   C'est le SEUL fichier à modifier pour changer les savons,
   leurs prix, leurs ingrédients ou l'adresse de contact.
   Tout le site (accueil, gamme, fiches, panier) se met à jour.
   ============================================================= */

window.ESTIVE = window.ESTIVE || {};

/* ---------- La boutique ---------- */
ESTIVE.boutique = {
  nom: 'Estive',
  email: 'contact@estive.fr',   // ⚠ À REMPLACER par votre vraie adresse avant la mise en ligne
  provenanceSuif: 'la ferme de Clemensaigne, à Longessaigne',   // d'où vient le suif (affiché sur l'accueil et la page « Le suif »)
  tailleCuvee: 25,              // pains par cuvée
  semainesAffinage: 10,         // durée minimale d'affinage
  quantiteMax: 25               // quantité maximale d'un même savon dans le panier
};

/* ---------- Les ingrédients ----------
   Chaque ingrédient est décrit une seule fois ici,
   puis appelé par sa clé (suif, olive, miel…) dans les savons.

   Pour ajouter du jojoba ou du karité à un savon :
   il suffit d'ajouter 'jojoba' ou 'karite' dans sa liste « ingredients ».
   Un ingrédient qui n'est utilisé par aucun savon n'apparaît nulle part.

   inci : dénomination officielle pour l'étiquetage.
   ⚠ À faire vérifier avant toute impression d'étiquette. */
ESTIVE.ingredients = {
  suif: {
    nom: 'Suif de bœuf',
    inci: 'Tallow',
    role: 'Le corps gras principal, issu de la ferme de Clemensaigne, à Longessaigne. Il nourrit la peau, donne au pain sa dureté et une mousse crémeuse.'
  },
  olive: {
    nom: "Huile d'olive",
    inci: 'Olea Europaea Fruit Oil',
    role: "Elle assouplit le pain, apporte du glissant et sert à infuser les plantes et la résine."
  },
  jojoba: {
    nom: 'Huile de jojoba',
    inci: 'Simmondsia Chinensis Seed Oil',
    role: 'Une cire végétale liquide, très stable, au toucher sec et non gras.'
  },
  karite: {
    nom: 'Beurre de karité',
    inci: 'Butyrospermum Parkii Butter',
    role: "Un beurre végétal qui ajoute de l'onctuosité au pain."
  },
  miel: {
    nom: 'Miel',
    inci: 'Mel',
    role: 'Il adoucit la mousse, lui donne de la tenue et colore le pain.'
  },
  resine: {
    nom: 'Résine de conifère',
    inci: '',                    // ⚠ À compléter selon l'espèce récoltée
    role: "Récoltée en forêt vers 1 400 mètres et fondue dans l'huile : une odeur de bois et de sous-bois."
  },
  thym: {
    nom: 'Thym',
    inci: 'Thymus Vulgaris Leaf',
    role: "Infusé dans l'huile avant la saponification, pour une odeur sèche et aromatique."   // ⚠ À confirmer selon votre méthode
  },
  eau: {
    nom: 'Eau',
    inci: 'Aqua',
    role: 'Elle dissout la soude avant la saponification.'
  },
  soude: {
    nom: 'Hydroxyde de sodium',
    inci: 'Sodium Hydroxide',
    role: 'Indispensable à la saponification, et entièrement consommé par la réaction.'
  }
};

/* ---------- Les savons ----------
   Ordre d'affichage = ordre de cette liste.

   image    : illustration provisoire. Quand vous aurez vos photos,
              déposez-les dans assets/img/savons/ (format paysage 4:3,
              1600 × 1200 px conseillé) et remplacez le chemin,
              par exemple 'assets/img/savons/miel.jpg'.
   teinte   : couleur du pain, utilisée pour la vignette du panier.
   disponible : mettre false quand une cuvée est épuisée. */
ESTIVE.produits = [
  {
    id: 'nature',
    nom: 'Nature',
    sousTitre: 'Suif, eau, soude.',
    prix: 16,                    // ⚠ Prix à confirmer
    poids: '100 g',
    teinte: '#F3EDE0',
    image: 'assets/img/savons/nature.svg',
    accroche: 'Le savon réduit à sa seule matière.',
    description: "La formule la plus courte que nous sachions faire, et la plus dense : trois ingrédients, rien d'autre. Sa mousse est discrète et crémeuse, et le pain dure plus longtemps que tous les autres.",
    odeur: 'Aucune : le suif purifié est inodore.',
    pour: 'Le corps et les mains, au quotidien, y compris les peaux sensibles.',
    usage: [
      "Faire mousser entre les mains ou sur un gant : la mousse vient lentement, c'est normal.",
      "Masser, puis rincer à l'eau tiède plutôt que chaude.",
      'Poser sur un porte-savon drainant entre deux usages.'
    ],
    ingredients: ['suif', 'eau', 'soude'],
    disponible: true
  },
  {
    id: 'miel',
    nom: 'Miel',
    sousTitre: 'Suif et miel.',
    prix: 18,
    poids: '100 g',
    teinte: '#E8CC97',
    image: 'assets/img/savons/miel.svg',
    accroche: "La douceur d'un pain d'hiver.",
    description: "Le miel est ajouté à la pâte au moment de la saponification. Il adoucit la mousse, lui donne de la tenue, et colore le pain d'une teinte dorée. Une note chaude et ronde, à peine perceptible.",
    odeur: 'Discrète, chaude et ronde.',
    pour: "Le corps et les mains, en particulier l'hiver.",
    usage: [
      'Faire mousser entre les mains ou sur un gant.',
      "Masser, puis rincer à l'eau tiède.",
      'Poser sur un porte-savon drainant entre deux usages.'
    ],
    ingredients: ['suif', 'olive', 'miel', 'eau', 'soude'],   // ⚠ Recette à confirmer
    disponible: true
  },
  {
    id: 'seve-de-pin',
    nom: 'Sève de pin',
    sousTitre: 'Résine de conifère, récoltée à 1 400 mètres.',
    prix: 18,
    poids: '100 g',
    teinte: '#D7B381',
    image: 'assets/img/savons/seve-de-pin.svg',
    accroche: 'Le pain de la forêt.',
    description: "Une résine de conifère ramassée en forêt vers 1 400 mètres, fondue dans l'huile avant la saponification. Elle donne au pain une odeur de bois et de sous-bois, franche et sèche, sans aucun parfum de synthèse.",
    odeur: 'Bois, résine, sous-bois. Elle se libère au contact de l’eau chaude.',
    pour: "Le corps et les mains, après l'effort.",
    usage: [
      'Faire mousser sur un gant plutôt qu’à même la peau du visage.',
      "Rincer à l'eau tiède.",
      'Laisser sécher entre deux usages : la résine fonce légèrement avec le temps.'
    ],
    ingredients: ['suif', 'olive', 'resine', 'eau', 'soude'],  // ⚠ Recette à confirmer
    disponible: true
  },
  {
    id: 'thym',
    nom: 'Thym',
    sousTitre: 'Suif et thym infusé.',
    prix: 18,
    poids: '100 g',
    teinte: '#E7E5D0',
    image: 'assets/img/savons/thym.svg',
    accroche: 'Une herbe des pentes sèches.',
    description: "Le thym est infusé dans l'huile avant la saponification. Il laisse au pain une odeur sèche, aromatique et chaude, celle des pentes ensoleillées en fin d'été.",
    odeur: 'Herbe sèche, aromatique et chaude.',
    pour: 'Le corps et les mains.',
    usage: [
      'Faire mousser entre les mains ou sur un gant.',
      "Masser, puis rincer à l'eau tiède.",
      'Poser sur un porte-savon drainant entre deux usages.'
    ],
    ingredients: ['suif', 'olive', 'thym', 'eau', 'soude'],    // ⚠ Recette à confirmer
    disponible: true
  }
];
