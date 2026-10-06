# Estive — le site

Site vitrine des savons Estive : six pages, un panier, la commande par e-mail.
Aucune installation n'est nécessaire.

## Voir le site

Double-cliquez sur `index.html`. Le site s'ouvre dans votre navigateur.

## Modifier un savon, un prix, un ingrédient

Tout se trouve dans un seul fichier : `assets/js/produits.js`.

- **Changer un prix** : modifiez la ligne `prix: 18` du savon concerné.
- **Changer la recette** : modifiez la liste `ingredients: ['suif', 'olive', 'miel', 'eau', 'soude']`.
  Pour ajouter du jojoba ou du karité, ajoutez `'jojoba'` ou `'karite'` dans cette liste.
  L'ingrédient apparaîtra automatiquement sur la fiche du savon et sur la page « Le suif ».
- **Signaler une cuvée épuisée** : passez `disponible: true` à `disponible: false`.
- **Changer l'adresse e-mail** : modifiez `email` en haut du fichier. Elle se met à jour sur tout le site.
- **Changer la provenance du suif** : modifiez `provenanceSuif` en haut du fichier
  (et la phrase du suif dans la liste des ingrédients).

## Mettre vos photos

1. Déposez vos photos dans `assets/img/savons/`, au format paysage 4:3 (1600 × 1200 px conseillé),
   par exemple `miel.jpg`.
2. Dans `produits.js`, remplacez `image: 'assets/img/savons/miel.svg'` par `image: 'assets/img/savons/miel.jpg'`.

La photo d'accueil est `assets/img/accueil.jpg` : remplacez le fichier en gardant le même nom.

## Avec Claude Code

Ouvrez ce dossier dans Claude Code. Le fichier `CLAUDE.md` lui donne le contexte de la marque,
les règles de rédaction et la direction artistique. Vous pouvez simplement demander, par exemple :
« ajoute un cinquième savon à la noisette à 18 € » ou « remplace l'illustration du thym par ma photo ».

## Mettre en ligne

Le dossier se publie tel quel sur n'importe quel hébergement de site statique :
- **Netlify Drop** : glissez le dossier sur app.netlify.com/drop.
- **Vercel** : depuis Claude Code, demandez « déploie le site sur Vercel ».
Reliez ensuite votre nom de domaine depuis le tableau de bord de l'hébergeur.

## Avant de vendre

- [ ] Déposer la photo d'accueil `assets/img/accueil.jpg` (elle n'est pas encore dans le dépôt).
- [ ] Remplacer `contact@estive.fr` par votre vraie adresse (`produits.js`).
- [ ] Confirmer les recettes de Miel, Sève de pin et Thym, et les prix (repérés par ⚠ dans `produits.js`).
- [ ] Remplacer les illustrations par vos photos.
- [ ] Ajouter mentions légales, conditions générales de vente et politique de confidentialité :
      elles sont obligatoires pour vendre en ligne en France.
- [ ] Mettre vos savons en conformité cosmétique : dossier d'information produit avec évaluation
      de la sécurité, notification sur le portail européen CPNP, étiquetage INCI.
      Les dénominations INCI de `produits.js` sont à faire vérifier.
- [x] Provenance du suif : la ferme de Clemensaigne, à Longessaigne (affichée sur l'accueil,
      la page « Le suif », l'atelier et les questions).
