(function () {
  'use strict';

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

  function initPageTransition() {
    document.body.classList.remove('is-leaving');

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        document.body.classList.remove('is-leaving');
      }
    });

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      var link = e.target.closest ? e.target.closest('a') : null;
      if (!link) return;
      if (link.target && link.target !== '_self') return;

      var href = link.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || href.indexOf('://') !== -1) return;
      if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;

      var url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin) return;

      e.preventDefault();
      document.body.classList.add('is-leaving');
      window.setTimeout(function () {
        window.location.href = link.href;
      }, 340);
    });
  }

  function init() {
    initNav();
    initToTop();
    initReveal();
    initPageTransition();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
