/**
 * head.js — éléments <head> communs à toutes les pages projet
 * Injecte : favicon QD/, preconnect Google Fonts, Google Fonts (Fraunces)
 *
 * Ce qui reste dans chaque page (unique par page) :
 *   - <meta name="description">
 *   - <title>
 *   - <link rel="stylesheet" href="../css/page-projet.css">
 *   - <script src="../js/analytics.js">
 */
(function () {
  var head = document.head;

  // Favicon QD/
  var favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="%23f5f4f2"/><text x="50%25" y="50%25" dominant-baseline="central" text-anchor="middle" font-family="Georgia%2C serif" font-weight="700" font-size="11" fill="%231a1a1a">QD%2F</text></svg>';
  head.appendChild(favicon);

  // Preconnect Google Fonts (performance)
  var pc1 = document.createElement('link');
  pc1.rel = 'preconnect';
  pc1.href = 'https://fonts.googleapis.com';
  head.appendChild(pc1);

  var pc2 = document.createElement('link');
  pc2.rel = 'preconnect';
  pc2.href = 'https://fonts.gstatic.com';
  pc2.crossOrigin = 'anonymous';
  head.appendChild(pc2);

  // Google Fonts — Fraunces
  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&display=swap';
  head.appendChild(font);
})();
