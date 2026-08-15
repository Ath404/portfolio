/* Atharv Chauhan — portfolio interactions
   Everything here is progressive enhancement: with JS off, the page is
   fully readable and nothing is hidden (the .js class gates all hiding). */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- current year in footer ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- reveal on scroll ---- */
  var revealables = document.querySelectorAll('.reveal, .timeline');

  if (!('IntersectionObserver' in window) || reduced) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealer.unobserve(entry.target);   // reveal once, never re-hide
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ---- nav: mark the section you're reading ---- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = {};
  document.querySelectorAll('nav a[href^="#"]').forEach(function (a) {
    navLinks[a.getAttribute('href').slice(1)] = a;
  });

  if (sections.length && 'IntersectionObserver' in window) {
    var visible = new Set();

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });

      var active = null;
      sections.forEach(function (s) { if (visible.has(s.id) && !active) active = s.id; });

      Object.keys(navLinks).forEach(function (id) {
        if (id === active) navLinks[id].setAttribute('aria-current', 'true');
        else navLinks[id].removeAttribute('aria-current');
      });
    }, { rootMargin: '-52px 0px -55% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }
})();
