/**
 * Midnight Dispatch — main.js
 * Handles: mobile nav, archive accordion, newsletter form, footer year, scroll effects
 */

(function () {
  'use strict';

  /* ============================================================
     UTILITY
     ============================================================ */
  function qs(selector, context) {
    return (context || document).querySelector(selector);
  }

  function qsa(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /* ============================================================
     MOBILE NAVIGATION
     ============================================================ */
  function initMobileNav() {
    var toggle = qs('.nav-toggle');
    var navList = qs('.nav-list');

    if (!toggle || !navList) return;

    toggle.addEventListener('click', function () {
      var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      toggle.classList.toggle('is-active');
      navList.classList.toggle('is-open');
    });

    // Close nav when a link is clicked
    qsa('.nav-list .nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        navList.classList.remove('is-open');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navList.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        navList.classList.remove('is-open');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        navList.classList.remove('is-open');
      }
    });
  }

  /* ============================================================
     STICKY HEADER SHADOW
     ============================================================ */
  function initStickyHeader() {
    var header = qs('.site-header');
    if (!header) return;

    function handleScroll() {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
      } else {
        header.style.boxShadow = 'none';
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ============================================================
     ARCHIVE ACCORDION
     ============================================================ */
  function initArchiveAccordion() {
    qsa('.archive-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        var targetId = btn.getAttribute('aria-controls');
        var panel = document.getElementById(targetId);

        if (!panel) return;

        if (isExpanded) {
          // Collapse
          btn.setAttribute('aria-expanded', 'false');
          slideUp(panel);
        } else {
          // Expand
          btn.setAttribute('aria-expanded', 'true');
          slideDown(panel);
        }
      });
    });
  }

  /* Simple slide down / slide up without jQuery */
  function slideDown(el) {
    el.hidden = false;
    el.style.overflow = 'hidden';
    el.style.height = '0';
    el.style.opacity = '0';

    var targetHeight = el.scrollHeight + 'px';

    // Trigger reflow
    el.offsetHeight; // eslint-disable-line no-unused-expressions

    el.style.transition = 'height 0.28s ease, opacity 0.28s ease';
    el.style.height = targetHeight;
    el.style.opacity = '1';

    el.addEventListener('transitionend', function onEnd() {
      el.style.height = '';
      el.style.overflow = '';
      el.style.transition = '';
      el.removeEventListener('transitionend', onEnd);
    });
  }

  function slideUp(el) {
    el.style.overflow = 'hidden';
    el.style.height = el.scrollHeight + 'px';
    el.style.opacity = '1';

    // Trigger reflow
    el.offsetHeight; // eslint-disable-line no-unused-expressions

    el.style.transition = 'height 0.28s ease, opacity 0.28s ease';
    el.style.height = '0';
    el.style.opacity = '0';

    el.addEventListener('transitionend', function onEnd() {
      el.hidden = true;
      el.style.height = '';
      el.style.overflow = '';
      el.style.opacity = '';
      el.style.transition = '';
      el.removeEventListener('transitionend', onEnd);
    });
  }

  /* ============================================================
     NEWSLETTER FORM
     ============================================================ */
  function initNewsletterForm() {
    var form = qs('#newsletter-form');
    if (!form) return;

    var emailInput = qs('#newsletter-email', form);
    var emailError = qs('#email-error', form);
    var successBox = qs('.form-success', form);

    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    function showError(msg) {
      emailInput.classList.add('is-error');
      emailError.textContent = msg;
    }

    function clearError() {
      emailInput.classList.remove('is-error');
      emailError.textContent = '';
    }

    emailInput.addEventListener('input', function () {
      if (emailInput.value.trim() === '') {
        clearError();
        return;
      }
      if (!validateEmail(emailInput.value)) {
        showError('Please enter a valid email address.');
      } else {
        clearError();
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = emailInput.value.trim();

      if (!email) {
        showError('Email address is required.');
        emailInput.focus();
        return;
      }

      if (!validateEmail(email)) {
        showError('Please enter a valid email address.');
        emailInput.focus();
        return;
      }

      clearError();

      // Simulate async submission
      form.classList.add('is-loading');
      var submitBtn = qs('[type="submit"]', form);
      submitBtn.disabled = true;

      setTimeout(function () {
        form.classList.remove('is-loading');
        submitBtn.disabled = false;

        // Hide form fields, show success
        qsa('.form-group, [type="submit"], .form-disclaimer', form).forEach(function (el) {
          el.style.display = 'none';
        });

        successBox.hidden = false;
        successBox.focus();
      }, 1200);
    });
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  function initFooterYear() {
    var yearEl = qs('#footer-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ============================================================
     SCROLL FADE-IN ANIMATION (Intersection Observer)
     ============================================================ */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    // Add animate class to elements
    var targets = qsa(
      '.post-card, .archive-group, .sidebar-widget, .newsletter-section'
    );

    targets.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease ' + (i * 0.04) + 's, transform 0.5s ease ' + (i * 0.04) + 's';
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     ACTIVE NAV LINK (scroll spy, simple version)
     ============================================================ */
  function initScrollSpy() {
    var sections = qsa('section[id], aside[id]');
    var navLinks = qsa('.nav-link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    function getActiveSection() {
      var scrollPos = window.scrollY + 100;
      var active = null;

      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollPos) {
          active = sec.id;
        }
      });

      return active;
    }

    function updateActiveLink() {
      var activeId = getActiveSection();

      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        var sectionId = href ? href.replace('#', '') : '';

        if (sectionId === activeId) {
          link.style.color = 'var(--color-accent)';
        } else {
          link.style.color = '';
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
  }

  /* ============================================================
     HERO PARALLAX (subtle)
     ============================================================ */
  function initHeroParallax() {
    var heroBg = qs('.hero-bg-grid');
    if (!heroBg) return;

    // Disable on low-end devices or prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', function () {
      var offset = window.scrollY;
      heroBg.style.transform = 'translateY(' + offset * 0.3 + 'px)';
    }, { passive: true });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    initMobileNav();
    initStickyHeader();
    initArchiveAccordion();
    initNewsletterForm();
    initFooterYear();
    initScrollAnimations();
    initScrollSpy();
    initHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
