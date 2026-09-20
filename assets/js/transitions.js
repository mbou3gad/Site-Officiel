/* ============================================================
   HOD FRAGONARD — TRANSITIONS DE PAGE
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const transitionEl = document.getElementById('page-transition');
  if (!transitionEl) return;

  // On page load, slide out
  window.addEventListener('pageshow', (e) => {
    // Si c'est un back/forward dans l'historique
    if (e.persisted) {
      transitionEl.classList.remove('in');
      transitionEl.classList.add('out');
    } else {
      // Retardé légèrement pour laisser le preloader s'il y en a un
      setTimeout(() => {
        transitionEl.classList.remove('in');
        transitionEl.classList.add('out');
      }, 100);
    }
  });

  // Intercept links for transition in
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    
    if (!link) return;
    
    // Ignorer les liens externes, les ancres, les target="_blank"
    const href = link.getAttribute('href');
    const target = link.getAttribute('target');
    
    if (
      !href || 
      href.startsWith('#') || 
      href.startsWith('mailto:') || 
      href.startsWith('tel:') || 
      target === '_blank' ||
      href.includes('wa.me')
    ) {
      return;
    }

    // Si même page d'accueil avec/sans slash, on peut ignorer pour fluidité, mais on laisse natif.
    // Transition in
    e.preventDefault();
    transitionEl.classList.remove('out');
    transitionEl.classList.add('in');

    setTimeout(() => {
      window.location.href = href;
    }, 450); // Temps de la transition CSS
  });
})();
