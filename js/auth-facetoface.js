/* ============================================================
   PORTFOLIO — Quentin De Graeve
   auth-facetoface.js — Protection par mot de passe du projet Face To Face
   ============================================================ */

(function () {
  /* ----------------------------------------------------------
     Configuration de la sécurité
     Le mot de passe est stocké sous forme d'empreinte SHA-256.
  ---------------------------------------------------------- */
  var PASSWORD_CONFIG = {
    // Empreinte SHA-256 du mot de passe autorisé
    hash: '6cb0941653ce459e9e23fb34042c8aa8a1232ee31f94620efe5ab7521f7361d0',
    // Clé de stockage de session
    storageKey: 'facetoface_authenticated'
  };

  /**
   * Calcule le hash SHA-256 d'une chaîne
   * @param {string} str
   * @returns {Promise<string>}
   */
  async function computeSHA256(str) {
    var buffer = new TextEncoder().encode(str);
    var hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  /**
   * Vérifie si le mot de passe saisi est correct (sensible à la casse via SHA-256)
   * @param {string} input
   * @returns {Promise<boolean>}
   */
  async function verifyPassword(input) {
    if (!input) return false;
    var cleaned = input.trim();
    var inputHash = await computeSHA256(cleaned);
    return inputHash === PASSWORD_CONFIG.hash;
  }

  /**
   * Vérifie si l'utilisateur est déjà authentifié dans cette session
   * @returns {boolean}
   */
  function isAuthenticated() {
    try {
      return sessionStorage.getItem(PASSWORD_CONFIG.storageKey) === 'true';
    } catch (e) {
      return false;
    }
  }

  /**
   * Enregistre l'authentification dans la session
   */
  function setAuthenticated() {
    try {
      sessionStorage.setItem(PASSWORD_CONFIG.storageKey, 'true');
    } catch (e) {}
  }

  /**
   * Initialise l'écran de mot de passe sur la page
   */
  function initPasswordGate() {
    var gate = document.getElementById('passwordGate');
    var form = document.getElementById('pwdForm');
    var input = document.getElementById('pwdInput');
    var error = document.getElementById('pwdError');
    var toggleVis = document.getElementById('pwdToggleVisibility');
    var contentRoot = document.querySelector('.site-root');

    if (!gate) return;

    // Si déjà authentifié, lever immédiatement le verrou
    if (isAuthenticated()) {
      gate.classList.add('is-unlocked');
      if (contentRoot) contentRoot.classList.remove('is-locked');
      return;
    }

    // Sinon, verrouiller le contenu
    if (contentRoot) contentRoot.classList.add('is-locked');
    gate.classList.remove('is-unlocked');

    // Focus automatique sur le champ mot de passe
    setTimeout(function () {
      if (input) input.focus();
    }, 100);

    // Bascule visibilité du mot de passe
    if (toggleVis && input) {
      toggleVis.addEventListener('click', function () {
        var isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        toggleVis.setAttribute('aria-pressed', String(isPassword));
        toggleVis.classList.toggle('is-visible', isPassword);
      });
    }

    // Soumission du formulaire
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var val = input ? input.value : '';

        try {
          var isValid = await verifyPassword(val);
          if (isValid) {
            // Mot de passe correct
            setAuthenticated();
            if (error) {
              error.textContent = '';
              error.classList.remove('show');
            }
            gate.classList.add('is-unlocked');
            if (contentRoot) contentRoot.classList.remove('is-locked');

            // Émettre un événement pour les scripts tiers (ex: lancement de Phaser)
            window.dispatchEvent(new CustomEvent('facetoface:unlocked'));

            // Charger l'iframe du jeu si nécessaire
            var iframe = document.querySelector('.proj-game iframe');
            if (iframe && iframe.dataset.src && !iframe.src) {
              iframe.src = iframe.dataset.src;
            }
          } else {
            // Mot de passe incorrect
            if (error) {
              error.textContent = 'Mot de passe incorrect. Veuillez réessayer.';
              error.classList.add('show');
            }
            gate.classList.remove('shake');
            // Forcer le reflow pour relancer l'animation
            void gate.offsetWidth;
            gate.classList.add('shake');
            if (input) {
              input.value = '';
              input.focus();
            }
          }
        } catch (err) {
          console.error('Erreur lors de la vérification :', err);
        }
      });
    }
  }

  // Exposition pour utilisation modulaire éventuelle
  window.FaceToFaceAuth = {
    isAuthenticated: isAuthenticated,
    verifyPassword: verifyPassword,
    setAuthenticated: setAuthenticated,
    init: initPasswordGate
  };

  // Exécution au chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordGate);
  } else {
    initPasswordGate();
  }
})();
