/**
 * Midnight Dispatch — Main Script
 */

(function () {
  'use strict';

  /* ============================================================
     MOBILE NAV TOGGLE
     ============================================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked
    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     NEWSLETTER FORM
     ============================================================ */
  const form = document.querySelector('.newsletter-form');
  const successMsg = document.querySelector('.newsletter-success');

  if (form && successMsg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = form.querySelector('#email-input');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!isValidEmail(email)) {
        showInputError(emailInput, 'Please enter a valid email address.');
        return;
      }

      clearInputError(emailInput);

      // Simulate async submission
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Subscribing…';
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        form.hidden = true;
        successMsg.hidden = false;
      }, 800);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showInputError(input, message) {
    if (!input) return;
    input.style.borderColor = '#e05050';
    input.style.boxShadow = '0 0 0 3px rgba(224,80,80,0.15)';

    let errorEl = input.parentNode.querySelector('.input-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'input-error';
      errorEl.style.cssText = 'font-family:system-ui,sans-serif;font-size:0.75rem;color:#e05050;margin-top:0.35rem;';
      input.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
    input.setAttribute('aria-describedby', 'email-error');
    errorEl.id = 'email-error';
  }

  function clearInputError(input) {
    if (!input) return;
    input.style.borderColor = '';
    input.style.boxShadow = '';
    const errorEl = input.parentNode.querySelector('.input-error');
    if (errorEl) errorEl.remove();
  }

  /* ============================================================
     ACTIVE NAV LINK ON SCROLL
     ============================================================ */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(function (link) {
              const href = link.getAttribute('href');
              if (href === '#' + id) {
                link.style.color = 'var(--color-accent)';
              } else {
                link.style.color = '';
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ============================================================
     SMOOTH REVEAL ON SCROLL (Intersection Observer)
     ============================================================ */
  const revealEls = document.querySelectorAll('.post-card, .widget');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealEls.forEach(function (el) {
      // Only apply JS-based reveal if reduced motion is not preferred
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      }
      revealObserver.observe(el);
    });
  }

  /* ============================================================
     HEADER SCROLL SHADOW
     ============================================================ */
  const header = document.querySelector('.site-header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
      } else {
        header.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* ============================================================
     ARCHIVE GROUP EXPAND (click-to-expand on mobile)
     ============================================================ */
  // Archive links are already visible; no accordion needed for this layout.
  // Included as progressive enhancement placeholder.

})();
