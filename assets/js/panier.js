/* =============================================================
   ESTIVE — Panier
   -------------------------------------------------------------
   Le panier est gardé dans le navigateur du visiteur (localStorage).
   La commande part par e-mail : le bouton « Commander par e-mail »
   ouvre la messagerie avec le récapitulatif déjà rédigé.
   Pour passer plus tard au paiement en ligne (Stripe, etc.),
   seule la fonction lienCommande() est à remplacer.
   ============================================================= */

(function () {
  'use strict';

  var E = window.ESTIVE;
  var CLE = 'estive-panier';
  var MAX = E.boutique.quantiteMax;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- État ---------- */

  // Ne garde que les savons existants et disponibles, en quantités valides.
  function lire(json) {
    var propre = {};
    try {
      var brut = JSON.parse(json || '{}') || {};
      Object.keys(brut).forEach(function (id) {
        var p = E.produit(id), n = parseInt(brut[id], 10);
        if (p && p.disponible && n > 0) propre[id] = Math.min(MAX, n);
      });
    } catch (e) { /* panier illisible : on repart de zéro */ }
    return propre;
  }

  var panier = {};
  try { panier = lire(localStorage.getItem(CLE)); } catch (e) { panier = {}; }

  function enregistrer() {
    try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (e) { /* navigation privée : le panier vit le temps de la page */ }
  }
  function ids() { return Object.keys(panier).filter(function (id) { return panier[id] > 0; }); }
  function nombre() { return ids().reduce(function (t, id) { return t + panier[id]; }, 0); }
  function total() { return ids().reduce(function (t, id) { return t + panier[id] * E.produit(id).prix; }, 0); }

  /* ---------- Éléments ---------- */

  var voile = document.createElement('div');
  voile.className = 'voile';
  voile.hidden = true;

  var tiroir = document.createElement('aside');
  tiroir.className = 'tiroir';
  tiroir.id = 'panier';
  tiroir.hidden = true;
  tiroir.setAttribute('role', 'dialog');
  tiroir.setAttribute('aria-modal', 'true');
  tiroir.setAttribute('aria-labelledby', 'panier-titre');
  tiroir.innerHTML =
    '<div class="tiroir-tete">' +
      '<h2 id="panier-titre">Votre panier</h2>' +
      '<button type="button" class="fermer" aria-label="Fermer le panier">' +
        '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="tiroir-corps">' +
      '<div class="vide"><p>' + E.t("Votre panier est vide pour l'instant.") + '</p>' +
      '<a class="btn btn-ghost" href="gamme.html">Voir la gamme</a></div>' +
      '<ul class="lignes"></ul>' +
    '</div>' +
    '<div class="tiroir-pied" hidden>' +
      '<p class="sous-total"><span>Sous-total</span><strong></strong></p>' +
      '<p class="info">' + E.t('Le paiement en ligne ouvrira prochainement. En attendant, votre commande nous parvient par e-mail : nous confirmons la disponibilité et les frais de port sous vingt-quatre heures ouvrées.') + '</p>' +
      '<a class="btn btn-commander" href="#">Commander par e-mail</a>' +
      '<p class="petit">Ou écrivez directement à <span data-email></span></p>' +
    '</div>';

  var annonce = document.createElement('div');
  annonce.className = 'annonce';
  annonce.setAttribute('role', 'status');
  annonce.setAttribute('aria-live', 'polite');
  annonce.innerHTML = '<span></span><button type="button" data-ouvrir-panier>Voir le panier</button>';

  document.body.appendChild(voile);
  document.body.appendChild(tiroir);
  document.body.appendChild(annonce);
  $('[data-email]', tiroir).textContent = E.boutique.email;

  var liste = $('.lignes', tiroir), vide = $('.vide', tiroir), pied = $('.tiroir-pied', tiroir);

  /* ---------- Commande ---------- */

  function lienCommande() {
    var lignes = ids().map(function (id) {
      var p = E.produit(id);
      return '- ' + panier[id] + ' x ' + p.nom + ' (' + E.euros(p.prix) + ' le pain)';
    });
    var corps = 'Bonjour,\n\nJe souhaiterais commander :\n' + lignes.join('\n') +
      '\n\nSous-total : ' + E.euros(total()) +
      '\n\nNom :\nAdresse de livraison :\nTéléphone :\n\nMerci.';
    return 'mailto:' + E.boutique.email +
      '?subject=' + encodeURIComponent('Commande ' + E.boutique.nom) +
      '&body=' + encodeURIComponent(corps.replace(/\n/g, '\r\n'));
  }

  /* ---------- Affichage ---------- */

  function rendre() {
    var liste_ids = ids();
    $$('[data-compte]').forEach(function (c) { c.textContent = nombre(); });
    vide.hidden = liste_ids.length > 0;
    pied.hidden = liste_ids.length === 0;
    liste.innerHTML = liste_ids.map(function (id) {
      var p = E.produit(id), nom = E.t(p.nom);
      return '<li class="ligne">' +
        '<div class="ligne-vignette" style="background:' + E.echapper(p.teinte) + '"></div>' +
        '<div>' +
          '<p class="ligne-nom">' + nom + '</p>' +
          '<p class="ligne-unite">' + E.euros(p.prix) + E.t(' le pain de ' + p.poids) + '</p>' +
          '<div class="ligne-actions">' +
            '<div class="qte qte-petite">' +
              '<button type="button" data-ligne="' + id + '" data-delta="-1" aria-label="Retirer un pain ' + nom + '">−</button>' +
              '<span>' + panier[id] + '</span>' +
              '<button type="button" data-ligne="' + id + '" data-delta="1" aria-label="Ajouter un pain ' + nom + '">+</button>' +
            '</div>' +
            '<button type="button" class="lien-discret" data-retirer="' + id + '">Retirer</button>' +
          '</div>' +
        '</div>' +
        '<p class="ligne-total">' + E.euros(p.prix * panier[id]) + '</p>' +
      '</li>';
    }).join('');
    $('.sous-total strong', tiroir).textContent = E.euros(total());
    $('.btn-commander', tiroir).href = lienCommande();
  }

  var minuteur;
  function annoncer(message) {
    $('span', annonce).textContent = message;
    annonce.classList.add('visible');
    clearTimeout(minuteur);
    minuteur = setTimeout(function () { annonce.classList.remove('visible'); }, 4500);
  }

  /* ---------- Ouverture et fermeture ---------- */

  var dernierFocus = null, fermeture;
  function ouvrir() {
    clearTimeout(fermeture);
    dernierFocus = document.activeElement;
    tiroir.hidden = false;
    voile.hidden = false;
    annonce.classList.remove('visible');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add('panier-ouvert'); });
    });
    $$('[aria-controls="panier"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('.fermer', tiroir).focus(); }, 80);
  }
  function fermer() {
    document.body.classList.remove('panier-ouvert');
    $$('[aria-controls="panier"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    document.body.style.overflow = '';
    fermeture = setTimeout(function () { tiroir.hidden = true; voile.hidden = true; }, 400);
    if (dernierFocus && document.contains(dernierFocus)) dernierFocus.focus();
  }

  /* ---------- Événements (délégués : fonctionnent sur tout le site) ---------- */

  document.addEventListener('click', function (e) {
    var cible = e.target.closest('button, a');
    if (!cible) return;

    // Ouvrir le panier
    if (cible.hasAttribute('data-ouvrir-panier')) { ouvrir(); return; }

    // Sélecteur de quantité d'une fiche
    if (cible.hasAttribute('data-pas')) {
      var champ = $('input', cible.closest('[data-qte]'));
      var v = (parseInt(champ.value, 10) || 1) + parseInt(cible.getAttribute('data-pas'), 10);
      champ.value = Math.max(1, Math.min(MAX, v));
      return;
    }

    // Ajouter au panier
    if (cible.hasAttribute('data-ajouter')) {
      var id = cible.getAttribute('data-ajouter'), p = E.produit(id);
      if (!p || !p.disponible) return;
      var bloc = cible.closest('.achat'), saisie = bloc && $('input', bloc);
      var n = Math.max(1, Math.min(MAX, parseInt(saisie && saisie.value, 10) || 1));
      panier[id] = Math.min(MAX, (panier[id] || 0) + n);
      enregistrer();
      rendre();
      if (saisie) saisie.value = 1;
      var nom = '« ' + p.nom + ' »';
      annoncer(E.typo(n > 1 ? n + ' pains ' + nom + ' ont été ajoutés au panier.' : 'Le savon ' + nom + ' a été ajouté au panier.'));
      return;
    }

    // Lignes du panier
    if (cible.hasAttribute('data-ligne') || cible.hasAttribute('data-retirer')) {
      var lid = cible.getAttribute('data-ligne') || cible.getAttribute('data-retirer');
      var delta = cible.getAttribute('data-delta');
      if (cible.hasAttribute('data-retirer')) delete panier[lid];
      else {
        panier[lid] = Math.min(MAX, (panier[lid] || 0) + parseInt(delta, 10));
        if (panier[lid] <= 0) delete panier[lid];
      }
      enregistrer();
      rendre();
      var suivant = panier[lid] ? $('[data-ligne="' + lid + '"][data-delta="' + delta + '"]', liste) : null;
      (suivant || $('.fermer', tiroir)).focus();
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.matches('[data-qte] input')) {
      var v = parseInt(e.target.value, 10);
      e.target.value = isNaN(v) ? 1 : Math.max(1, Math.min(MAX, v));
    }
  });

  $('.fermer', tiroir).addEventListener('click', fermer);
  voile.addEventListener('click', fermer);
  $('.vide a', tiroir).addEventListener('click', function () { if (document.body.getAttribute('data-page') === 'gamme') fermer(); });

  tiroir.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); fermer(); return; }
    if (e.key !== 'Tab') return;
    var focusables = $$('a[href], button:not([disabled]), input', tiroir).filter(function (el) { return el.offsetParent !== null; });
    if (!focusables.length) return;
    var premier = focusables[0], dernier = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
    else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
  });

  // Un autre onglet a modifié le panier : on se resynchronise.
  window.addEventListener('storage', function (e) {
    if (e.key !== CLE) return;
    panier = lire(e.newValue);
    rendre();
  });

  rendre();
})();
