/* =============================================================
   ESTIVE — Mise en page commune et rendu des pages
   -------------------------------------------------------------
   - insère l'en-tête et le pied de page sur chaque page ;
   - affiche les savons à partir de produits.js ;
   - gère le menu mobile et les petits détails d'interface.
   Ce script est chargé en haut du <body> pour que l'en-tête
   apparaisse sans délai.
   ============================================================= */

(function () {
  'use strict';

  var E = window.ESTIVE;
  var page = document.body.getAttribute('data-page') || '';
  document.documentElement.classList.add('js');

  /* ---------- Outils ---------- */

  // Apostrophes typographiques et espaces insécables à la française.
  E.typo = function (s) {
    return String(s)
      .replace(/'/g, '’')
      .replace(/« /g, '« ')
      .replace(/ »/g, ' »')
      .replace(/ :/g, ' :')
      .replace(/ ([;?!])/g, ' $1');
  };
  E.echapper = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  E.t = function (s) { return E.echapper(E.typo(s)); };
  E.euros = function (n) {
    return (n % 1 ? n.toFixed(2) : String(n)).replace('.', ',') + ' €';
  };
  E.produit = function (id) {
    for (var i = 0; i < E.produits.length; i++) if (E.produits[i].id === id) return E.produits[i];
    return null;
  };
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function lienFiche(p) { return 'savon.html?id=' + encodeURIComponent(p.id); }

  /* ---------- En-tête ---------- */

  var NAV = [
    { href: 'gamme.html', titre: 'La gamme', page: 'gamme' },
    { href: 'suif.html', titre: 'Le suif', page: 'suif' },
    { href: 'atelier.html', titre: "L'atelier", page: 'atelier' },
    { href: 'faq.html', titre: 'Questions', page: 'faq' }
  ];
  function liensNav() {
    return NAV.map(function (n) {
      var actif = n.page === page || (page === 'savon' && n.page === 'gamme');
      return '<a href="' + n.href + '"' + (actif ? ' aria-current="page"' : '') + '>' + E.t(n.titre) + '</a>';
    }).join('');
  }

  var entete = document.createElement('header');
  entete.className = 'site-head';
  entete.innerHTML =
    '<a class="skip" href="#contenu">Aller au contenu</a>' +
    '<div class="wrap head-row">' +
      '<a class="brand" href="index.html">' + E.t(E.boutique.nom) + '</a>' +
      '<nav class="nav" aria-label="Navigation principale">' + liensNav() + '</nav>' +
      '<div class="head-actions">' +
        '<button type="button" class="cart-btn" data-ouvrir-panier aria-controls="panier" aria-expanded="false">Panier (<span data-compte>0</span>)</button>' +
        '<button type="button" class="menu-btn" aria-controls="menu-mobile" aria-expanded="false">Menu</button>' +
      '</div>' +
    '</div>' +
    '<nav class="mnav" id="menu-mobile" aria-label="Navigation mobile" hidden>' + liensNav() + '</nav>';
  document.body.insertBefore(entete, document.body.firstChild);

  /* ---------- Gabarits réutilisables ---------- */

  function carte(p) {
    return '<a class="carte" href="' + lienFiche(p) + '">' +
      '<figure class="media"><img src="' + E.echapper(p.image) + '" alt="' + E.t('Savon ' + p.nom) + '" loading="lazy" width="1200" height="900"></figure>' +
      '<h3>' + E.t(p.nom) + '</h3>' +
      '<p class="carte-sous">' + E.t(p.sousTitre) + '</p>' +
      '<p class="carte-prix">' + E.euros(p.prix) + ' <span>' + E.t('le pain de ' + p.poids) + '</span></p>' +
    '</a>';
  }

  function achat(p) {
    if (!p.disponible) {
      return '<p class="epuise">' + E.t('Cuvée épuisée. La suivante sera disponible au terme de son affinage.') + '</p>';
    }
    var nom = E.t(p.nom);
    return '<div class="achat">' +
      '<div class="qte" data-qte>' +
        '<button type="button" data-pas="-1" aria-label="Diminuer la quantité de ' + nom + '">−</button>' +
        '<input type="number" inputmode="numeric" min="1" max="' + E.boutique.quantiteMax + '" value="1" aria-label="Quantité de ' + nom + '">' +
        '<button type="button" data-pas="1" aria-label="Augmenter la quantité de ' + nom + '">+</button>' +
      '</div>' +
      '<button type="button" class="btn" data-ajouter="' + E.echapper(p.id) + '">Ajouter au panier</button>' +
    '</div>';
  }

  function prix(p) {
    return '<p class="prix"><strong>' + E.euros(p.prix) + '</strong><span>' + E.t('le pain de ' + p.poids) + '</span></p>';
  }

  function ingredientsDe(p) {
    return p.ingredients.map(function (k) { return E.ingredients[k]; }).filter(Boolean);
  }

  /* ---------- Rendus par page ---------- */

  // Accueil et fiche : grille de cartes. data-cartes="tous" ou "autres:<id>"
  function rendreCartes() {
    $$('[data-cartes]').forEach(function (el) {
      var mode = el.getAttribute('data-cartes');
      var liste = E.produits;
      if (mode.indexOf('autres:') === 0) {
        var exclu = mode.slice(7);
        liste = liste.filter(function (p) { return p.id !== exclu; });
      }
      el.innerHTML = liste.map(carte).join('');
    });
  }

  // Page gamme : un savon par rangée, en alternance.
  function rendreGamme() {
    var el = $('[data-gamme]');
    if (!el) return;
    el.innerHTML = E.produits.map(function (p, i) {
      return '<article class="produit' + (i % 2 ? ' inverse' : '') + '" aria-labelledby="p-' + p.id + '">' +
        '<a class="produit-media media" href="' + lienFiche(p) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + E.echapper(p.image) + '" alt="" loading="lazy" width="1200" height="900">' +
        '</a>' +
        '<div class="produit-info">' +
          '<h2 id="p-' + p.id + '">' + E.t(p.nom) + '</h2>' +
          '<p class="sous">' + E.t(p.sousTitre) + '</p>' +
          '<p>' + E.t(p.accroche + ' ' + p.description) + '</p>' +
          prix(p) + achat(p) +
          '<a class="lien voir-fiche" href="' + lienFiche(p) + '">Composition et usage</a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  // Fiche d'un savon : savon.html?id=miel
  function rendreFiche() {
    var el = $('[data-fiche]');
    if (!el) return;
    var id = new URLSearchParams(location.search).get('id');
    var p = E.produit(id) || (id ? null : E.produits[0]);
    if (!p) {
      el.innerHTML = '<section class="wrap introuvable"><h1 class="titre">' + E.t('Ce savon est introuvable.') + '</h1>' +
        '<p class="lead">' + E.t("Il n'existe pas ou n'est plus proposé.") + '</p><a class="btn" href="gamme.html">Voir la gamme</a></section>';
      return;
    }
    document.title = 'Savon ' + E.typo(p.nom) + ' | ' + E.boutique.nom;

    var compo = ingredientsDe(p).map(function (ing) {
      return '<dt>' + E.t(ing.nom) + '</dt><dd>' + E.t(ing.role) + (ing.inci ? '<small>' + E.echapper(ing.inci) + '</small>' : '') + '</dd>';
    }).join('');
    var usage = p.usage.map(function (u) { return '<li>' + E.t(u) + '</li>'; }).join('');

    el.innerHTML =
      '<section class="wrap fiche">' +
        '<figure class="media"><img src="' + E.echapper(p.image) + '" alt="' + E.t('Savon ' + p.nom) + '" width="1200" height="900"></figure>' +
        '<div>' +
          '<p class="fil"><a href="gamme.html">La gamme</a></p>' +
          '<h1>' + E.t(p.nom) + '</h1>' +
          '<p class="sous">' + E.t(p.sousTitre) + '</p>' +
          '<p class="accroche">' + E.t(p.accroche) + '</p>' +
          '<p>' + E.t(p.description) + '</p>' +
          prix(p) + achat(p) +
          '<p class="note">' + E.t('Cuvée de ' + E.boutique.tailleCuvee + ' pains, affinée ' + E.boutique.semainesAffinage + ' semaines au minimum.') + '</p>' +
        '</div>' +
      '</section>' +
      '<section class="section"><div class="wrap details">' +
        '<div><h2>Composition</h2><dl>' + compo + '</dl></div>' +
        '<div class="bloc"><h2>' + E.t('Odeur et usage') + '</h2>' +
          '<h3>Odeur</h3><p>' + E.t(p.odeur) + '</p>' +
          '<h3>Pour</h3><p>' + E.t(p.pour) + '</p></div>' +
        '<div><h2>Mode d’emploi</h2><ol>' + usage + '</ol></div>' +
      '</div></section>' +
      '<section class="section"><div class="wrap">' +
        '<div class="tete-section"><h2 class="titre">Les autres pains</h2></div>' +
        '<div class="cartes cartes-3" data-cartes="autres:' + E.echapper(p.id) + '"></div>' +
      '</div></section>';
  }

  // Page suif : ingrédients réellement utilisés dans la gamme.
  function rendreIngredients() {
    var el = $('[data-ingredients]');
    if (!el) return;
    var html = Object.keys(E.ingredients).map(function (k) {
      var savons = E.produits.filter(function (p) { return p.ingredients.indexOf(k) !== -1; });
      if (!savons.length) return '';
      var ing = E.ingredients[k];
      var dans = savons.length === E.produits.length
        ? 'Dans tous les pains'
        : 'Dans : ' + savons.map(function (p) { return p.nom; }).join(', ');
      return '<li><h3>' + E.t(ing.nom) + '</h3><p>' + E.t(ing.role) + '</p><p class="dans">' + E.t(dans) + '</p></li>';
    }).join('');
    el.innerHTML = html;
  }

  // Adresse e-mail : tout élément [data-email] reçoit le lien (et le texte s'il est vide).
  function rendreEmails() {
    $$('[data-email]').forEach(function (a) {
      if (a.tagName === 'A') a.href = 'mailto:' + E.boutique.email;
      if (!a.textContent.trim()) a.textContent = E.boutique.email;
    });
  }

  // Valeurs de la boutique dans le texte : <span data-valeur="tailleCuvee"></span>
  function rendreValeurs() {
    $$('[data-valeur]').forEach(function (s) {
      var v = E.boutique[s.getAttribute('data-valeur')];
      if (v !== undefined) s.textContent = E.typo(v);
    });
  }

  /* ---------- Pied de page ---------- */

  function rendrePied() {
    var pied = document.createElement('footer');
    pied.className = 'site-foot';
    pied.id = 'contact';
    pied.innerHTML =
      '<div class="wrap">' +
        '<div class="foot-row">' +
          '<div><p class="foot-brand">' + E.t(E.boutique.nom) + '</p>' +
          '<p>' + E.t("L'estive, c'est le pâturage d'altitude où montent les troupeaux l'été. Savonnerie artisanale en Haute-Savoie.") + '</p></div>' +
          '<div class="foot-contact"><a class="foot-mail" data-email></a>' +
          '<p>' + E.t('Une question sur un pain, une commande, une cuvée ? Nous répondons personnellement.') + '</p></div>' +
        '</div>' +
        '<nav class="foot-nav" aria-label="Pied de page">' +
          NAV.map(function (n) { return '<a href="' + n.href + '">' + E.t(n.titre) + '</a>'; }).join('') +
        '</nav>' +
        '<p class="foot-base">© ' + new Date().getFullYear() + ' ' + E.t(E.boutique.nom) + '. Fait main en Haute-Savoie.</p>' +
      '</div>';
    var main = $('main');
    main.parentNode.insertBefore(pied, main.nextSibling);
  }

  /* ---------- Interface ---------- */

  function menuMobile() {
    var bouton = $('.menu-btn', entete), menu = $('#menu-mobile');
    bouton.addEventListener('click', function () {
      var ouvert = bouton.getAttribute('aria-expanded') === 'true';
      bouton.setAttribute('aria-expanded', String(!ouvert));
      menu.hidden = ouvert;
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { bouton.setAttribute('aria-expanded', 'false'); menu.hidden = true; });
    });
  }

  function enteteAuDefilement() {
    function maj() { entete.classList.toggle('defile', window.scrollY > 8); }
    window.addEventListener('scroll', maj, { passive: true });
    maj();
  }

  document.addEventListener('DOMContentLoaded', function () {
    rendreGamme();
    rendreFiche();
    rendreCartes();
    rendreIngredients();
    rendrePied();
    rendreEmails();
    rendreValeurs();
    menuMobile();
    enteteAuDefilement();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.documentElement.classList.add('pret'); });
    });
  });
})();
