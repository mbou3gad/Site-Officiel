/* ============================================================
   HOD FRAGONARD — PRÉLOADER v2
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loader = document.getElementById('preloader');
  if (!loader) return;

  const textEl = loader.querySelector('.preloader-text');
  const subEl  = loader.querySelector('.preloader-sub');

  if (reduced) {
    loader.classList.add('hide');
    document.body.style.overflow = '';
    return;
  }

  document.body.style.overflow = 'hidden';

  const frames = ['H', 'HO', 'HOD', 'HOD FRAGONARD'];
  let i = 0;

  const tick = () => {
    if (i < frames.length) {
      textEl.textContent = frames[i];
      i++;
      setTimeout(tick, i < frames.length ? 220 : 380);
    } else {
      // Afficher le sous-titre
      if (subEl) subEl.style.opacity = '1';
      // Masquer après pause
      setTimeout(() => {
        loader.classList.add('hide');
        setTimeout(() => {
          loader.remove();
          document.body.style.overflow = '';
        }, 700);
      }, 700);
    }
  };

  tick();
})();
