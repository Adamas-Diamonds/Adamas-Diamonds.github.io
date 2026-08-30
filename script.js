(function () {
  'use strict';

  var STORAGE_KEY = 'ad-theme';
  var root = document.documentElement;

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function applyTheme(theme) {
    var isDark = theme === 'dark';
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    var sun = document.getElementById('iconSun');
    var moon = document.getElementById('iconMoon');
    if (sun && moon) {
      sun.style.display = isDark ? 'none' : 'inline';
      moon.style.display = isDark ? 'inline' : 'none';
    }
  }

  function initTheme() {
    var saved = getSavedTheme();
    applyTheme(saved === 'light' ? 'light' : 'dark');

    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      });
    }
  }

  function initNav() {
    var toggle = document.getElementById('navToggle');
    var list = document.getElementById('navList');
    if (!toggle || !list) return;

    toggle.addEventListener('click', function () {
      var isOpen = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    list.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        list.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.classList.contains('is-open')) {
        list.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  function initToTop() {
    var btn = document.getElementById('toTop');
    if (!btn) return;

    var onScroll = function () {
      var visible = window.scrollY > 480;
      btn.classList.toggle('is-visible', visible);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  function init() {
    initTheme();
    initNav();
    initToTop();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
