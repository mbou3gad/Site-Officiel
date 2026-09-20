/* ============================================================
   HOD FRAGONARD — JAVASCRIPT PRINCIPAL v2.0
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. HEADER STICKY & ACTIVE LINKS ─────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Init
  }

  /* ── 2. MENU MOBILE ──────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    const toggleMenu = () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    hamburger.addEventListener('click', toggleMenu);
    
    // Fermer au clic sur un lien
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (hamburger.classList.contains('open')) toggleMenu();
      });
    });
  }

  /* ── 3. ANIMATIONS AU SCROLL (Intersection Observer) ─────── */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-l, .reveal-r, .reveal-up, .reveal-scale, .reveal-clip'
  );

  if (revealElements.length > 0) {
    if (reducedMotion) {
      revealElements.forEach(el => el.classList.add('in'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8%' });

      revealElements.forEach(el => observer.observe(el));
    }
  }

  /* ── 4. PARALLAX SUR HERO & IMAGES ───────────────────────── */
  if (!reducedMotion && !window.matchMedia('(max-width: 768px)').matches) {
    const heroImg = document.querySelector('.hero-image-wrap');
    if (heroImg) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroImg.style.transform = `translateY(${y * 0.15}px)`;
        }
      }, { passive: true });
    }
  }

  /* ── 5. TEXT REVEAL (Hero) ───────────────────────────────── */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !reducedMotion) {
    // Split texte par mots pour une animation séquentielle (si non géré par preloader, mais on le fait pour assurer)
    setTimeout(() => {
      const words = heroTitle.querySelectorAll('.word');
      if(words.length === 0) {
        heroTitle.classList.add('visible'); // fallback
      } else {
        words.forEach((w, i) => {
          setTimeout(() => w.classList.add('visible'), i * 150);
        });
      }
    }, 600); // après preloader
  }

  /* ── 6. BACK TO TOP ──────────────────────────────────────── */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    }, { passive: true });
    
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 7. FILTRES & GALERIE LIGHTBOX ───────────────────────── */
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxInner = document.querySelector('.lightbox-inner');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  // Tableau de toutes les images actuellement visibles pour la navigation lightbox
  let currentVisibleItems = Array.from(galleryItems);
  let currentIndex = 0;

  // Filtres
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        
        currentVisibleItems = [];
        
        galleryItems.forEach(item => {
          if (filter === 'TOUS' || item.dataset.category === filter) {
            item.style.display = 'block';
            // Trigger reflow pour anim
            void item.offsetWidth;
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            currentVisibleItems.push(item);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              if(!item.style.opacity || item.style.opacity === '0') {
                item.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  // Lightbox opening
  if (lightbox && galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        currentIndex = currentVisibleItems.indexOf(item);
        if(currentIndex === -1) currentIndex = 0;
        
        showLightboxImage(currentIndex);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    const showLightboxImage = (index) => {
      const item = currentVisibleItems[index];
      const imgContent = item.querySelector('.gallery-item-img').innerHTML;
      lightboxInner.innerHTML = `<div class="lightbox-content-area">${imgContent}</div>`;
    };

    const nextImage = () => {
      currentIndex = (currentIndex + 1) % currentVisibleItems.length;
      showLightboxImage(currentIndex);
    };

    const prevImage = () => {
      currentIndex = (currentIndex - 1 + currentVisibleItems.length) % currentVisibleItems.length;
      showLightboxImage(currentIndex);
    };

    document.querySelector('.lightbox-next')?.addEventListener('click', nextImage);
    document.querySelector('.lightbox-prev')?.addEventListener('click', prevImage);

    // Clavier
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  }

  /* ── 8. FORMULAIRE CONTACT ───────────────────────────────── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const honeypot = contactForm.querySelector('.honeypot');
      if (honeypot && honeypot.value !== '') return; // Spam trap
      
      const btn = contactForm.querySelector('.btn-submit');
      const msg = contactForm.querySelector('.form-msg');
      
      // Basic HTML5 validation fallback
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      
      btn.textContent = 'Envoi en cours...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      
      // Simulation d'envoi
      setTimeout(() => {
        btn.textContent = 'Envoyer le message';
        btn.disabled = false;
        btn.style.opacity = '1';
        contactForm.reset();
        
        msg.textContent = "Votre message a été envoyé avec succès. Je vous répondrai dans les meilleurs délais.";
        msg.classList.remove('error');
        msg.classList.add('success');
        
        setTimeout(() => {
          msg.classList.remove('success');
        }, 8000);
      }, 1500);
    });
  }

});
