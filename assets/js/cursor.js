/* ============================================================
   HOD FRAGONARD — CURSEUR PERSONNALISÉ
   ============================================================ */
(function () {
  'use strict';

  // Désactiver sur mobile et si reduced-motion
  if (window.matchMedia('(max-width: 1024px)').matches || 
      window.matchMedia('(hover: none)').matches || 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const dot   = document.getElementById('cursor-dot');
  const ring  = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');

  if (!dot || !ring || !label) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  // Lissage du ring (inertie)
  const speed = 0.2;

  const animate = () => {
    ringX += (mouseX - ringX) * speed;
    ringY += (mouseY - ringY) * speed;

    dot.style.transform   = `translate(${mouseX}px, ${mouseY}px)`;
    ring.style.transform  = `translate(${ringX}px, ${ringY}px)`;
    label.style.transform = `translate(${ringX}px, ${ringY - 45}px)`; // Label au-dessus du ring

    requestAnimationFrame(animate);
  };
  animate();

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // États au hover sur éléments interactifs
  const interactives = document.querySelectorAll('a, button, input, select, textarea, .gallery-item, .filter-btn');
  
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hover');
      
      // Texte contextuel optionnel
      const customLabel = el.getAttribute('data-cursor');
      if (customLabel) {
        label.textContent = customLabel;
        label.classList.add('show');
        dot.style.opacity = '0';
      }
    });
    
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover');
      label.classList.remove('show');
      dot.style.opacity = '1';
    });
  });

  // Clic effect
  window.addEventListener('mousedown', () => ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(0.85)`);
  window.addEventListener('mouseup',   () => ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(1)`);
})();
