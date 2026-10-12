/* ============================================================
   PORTFOLIO — Quentin De Graeve
   main.js
   ============================================================ */

(function () {

  /* ----------------------------------------------------------
     Chargement dynamique des cartes projet
     Ajouter un projet : créer projets/projet-XX-nom.html
     puis ajouter son chemin dans le tableau ci-dessous.
  ---------------------------------------------------------- */
  var projectFiles = [
    'projets/projet-01-rag.html',
    'projets/projet-02-pidog.html',
    'projets/projet-03-api-cloud.html',
    'projets/projet-04-space-dodge.html',
    'projets/projet-05-lander.html',
    'projets/projet-06-twin-clash.html'
  ];

  var grid = document.getElementById('projectGrid');

  function initProjectFeatures() {
    /* Navigation vers la page dédiée au clic sur la carte */
    document.querySelectorAll('.project-card[data-page]').forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        /* Ne pas naviguer si le clic est sur le bouton accordéon ou un lien interne */
        if (e.target.closest('.project-open') || e.target.closest('a')) return;
        window.location.href = card.dataset.page;
      });
    });

    /* Filtres */
    var filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
    var projectCards  = Array.from(document.querySelectorAll('.project-card'));

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.dataset.filter;

        filterButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === button));
        });

        projectCards.forEach(function (card) {
          var categories = (card.dataset.categories || '').split(' ');
          var visible    = filter === 'all' || categories.includes(filter);
          card.style.display = visible ? '' : 'none';

          if (!visible) {
            var detail = card.querySelector('.project-detail');
            var open   = card.querySelector('.project-open');
            if (detail) detail.hidden = true;
            if (open) {
              open.setAttribute('aria-expanded', 'false');
              var label = open.querySelector('span:first-child');
              if (label) label.textContent = 'Lire l\u2019\u00e9tude de cas';
            }
          }
        });
      });
    });

    /* Accordéons */
    document.querySelectorAll('.project-open').forEach(function (button) {
      button.addEventListener('click', function () {
        var card       = button.closest('.project-card');
        var detail     = card.querySelector('.project-detail');
        var shouldOpen = detail.hidden;

        detail.hidden = !shouldOpen;
        button.setAttribute('aria-expanded', String(shouldOpen));
        button.querySelector('span:first-child').textContent = shouldOpen
          ? 'Refermer l\u2019\u00e9tude de cas'
          : 'Lire l\u2019\u00e9tude de cas';
        button.querySelector('span:last-child').textContent = shouldOpen ? '\u2198' : '\u2197';
      });
    });

    /* Reveal au scroll (IntersectionObserver) */
    var revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach(function (item) { observer.observe(item); });
    } else {
      revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    }
  }

  if (grid && typeof fetch !== 'undefined') {
    var loaded = 0;
    projectFiles.forEach(function (file) {
      fetch(file)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var tmp = document.createElement('div');
          tmp.innerHTML = html.trim();
          while (tmp.firstChild) { grid.appendChild(tmp.firstChild); }
          loaded++;
          if (loaded === projectFiles.length) { initProjectFeatures(); }
        })
        .catch(function (err) {
          console.warn('Impossible de charger', file, err);
          loaded++;
          if (loaded === projectFiles.length) { initProjectFeatures(); }
        });
    });
  } else {
    initProjectFeatures();
  }

  /* ----------------------------------------------------------
     Menu burger (mobile)
  ---------------------------------------------------------- */
  var menuToggle = document.getElementById('menuToggle');
  var navLinks   = document.getElementById('navLinks');

  menuToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Fermer −' : 'Menu +';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = 'Menu +';
    });
  });

  /* ----------------------------------------------------------
     Toast de notification
  ---------------------------------------------------------- */
  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 3600);
  }

  document.querySelectorAll('[data-config-link]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var label = link.querySelector('span:first-child').textContent;
      showToast('À configurer avant publication\u00a0: ajoute ton véritable lien ' + label + '.');
    });
  });

  /* ----------------------------------------------------------
     Bascule de thème (Sombre / Clair)
  ---------------------------------------------------------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var currentTheme = document.documentElement.style.colorScheme || 'light dark';
      var activeTheme;

      if (currentTheme === 'light') {
        activeTheme = 'light';
      } else if (currentTheme === 'dark') {
        activeTheme = 'dark';
      } else {
        // Détecte la préférence système en cours
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      var nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.style.colorScheme = nextTheme;
      localStorage.setItem('theme', nextTheme);
    });
  }

})();
