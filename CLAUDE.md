# Estive — site vitrine

Site d'Estive, savonnerie artisanale de savons au suif de bœuf, fabriqués près de Cluses (Haute-Savoie).
Le propriétaire n'est pas développeur : expliquer simplement ce qui change, en français.

## Technique

- HTML, CSS et JavaScript sans framework, sans dépendance, sans étape de compilation.
  Le site s'ouvre en double-cliquant sur `index.html`. Ne pas introduire de framework ni de bundler sans demande explicite.
- Scripts classiques (pas de modules ES) pour que le site fonctionne aussi en `file://`.
- Pour tester avec un serveur local : `npx serve .`

## Structure

```
index.html        Accueil
gamme.html        Les quatre savons, avec ajout au panier
savon.html        Fiche d'un savon : savon.html?id=miel
suif.html         Les bienfaits du suif et la liste des ingrédients
atelier.html      La fabrication, les cuvées, le nom
faq.html          Questions fréquentes
assets/css/style.css     Toute la mise en forme (réglages de couleurs et polices en tête de fichier)
assets/js/produits.js    LES DONNÉES : boutique, ingrédients, savons. Seul fichier à modifier pour le catalogue.
assets/js/site.js        En-tête, pied de page, rendu des savons, menu mobile
assets/js/panier.js      Panier (localStorage) et commande par e-mail
assets/img/              Photo d'accueil, illustrations des savons et de l'atelier
```

Règles :
- Les savons, prix, ingrédients, l'e-mail, la provenance du suif, la taille des cuvées et la durée d'affinage vivent uniquement dans `produits.js`. Ne jamais les écrire en dur dans le HTML (utiliser `data-valeur`, `data-email` ou le rendu de `site.js`).
- Un ingrédient défini dans `ESTIVE.ingredients` mais utilisé par aucun savon n'apparaît nulle part sur le site.
- L'en-tête et le pied de page sont générés par `site.js` : modifier la navigation dans le tableau `NAV`.
- Pas de styles en ligne dans le HTML : tout passe par `style.css`.

## Commandes

Pas de paiement en ligne pour l'instant. Le panier génère un e-mail pré-rempli (`lienCommande()` dans `panier.js`).
Pour passer à Stripe plus tard, seule cette fonction est à remplacer.

## Contenu et ton

- Français soutenu, vouvoiement, phrases sobres. Typographie française (apostrophe ’, espaces insécables avant : ; ? !).
  `ESTIVE.typo()` le fait automatiquement pour le texte généré.
- Ne jamais inventer : chiffres, études, avis clients, provenance du suif, labels, délais de livraison.
  Si une information manque, laisser un emplacement signalé `⚠ À compléter` dans le code et le dire au propriétaire.
- Allégations cosmétiques prudentes (règlements CE 1223/2009 et UE 655/2013) : « aide à », « étudié pour »,
  jamais « guérit », « soigne », « anti-inflammatoire » au sens médical.
- Le suif reste majoritaire dans chaque savon. Huiles d'appoint possibles : olive, jojoba, karité.
  Le jojoba et le karité viennent de graines : ne pas écrire « sans huile de graines » si l'un d'eux est utilisé.
- Jamais d'huile de palme. Odeurs appréciées : thym, miel, bois, noisette. Éviter les notes médicinales.
- Faits établis : cuvées de 25 pains, affinage de 10 semaines minimum, prix visé 15 à 20 € le pain de 100 g.
- Provenance du suif : la ferme de Clemensaigne, à Longessaigne (`ESTIVE.boutique.provenanceSuif`).
  Ne rien ajouter sur cette ferme (race, mode d'élevage, labels) sans confirmation du propriétaire.

## Direction artistique

- Références : Chantecaille, Delozale, La Mer (luxe), L'Occitane (démarche).
- Fond blanc lumineux, jamais beige. Encre `#231f1c`. Un seul moment sombre : l'ouverture de l'accueil (`#473323`, prolonge la photo).
- Polices : Newsreader (titres et texte, graisses légères) et Hanken Grotesk (prix, boutons, petits libellés).
- Boutons en pilule, beaucoup d'espace, une seule animation orchestrée (l'ouverture de l'accueil).
- À éviter : surtitres en majuscules espacées, emojis, dégradés décoratifs, flèches « → » dans les boutons, cartes à ombre portée.

## Évolutions prévues

- Remplacer les illustrations `.svg` des savons par de vraies photos (format 4:3, 1600 × 1200 px).
- La marque s'étendra à d'autres cosmétiques simples, dont deux crèmes visage anhydres au suif de rognon.
  Garder une structure qui permettra d'ajouter une catégorie de produits sans tout réécrire.
