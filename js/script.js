/* =========================================================
   THEJAS PORTFOLIO — SCRIPT
   Contents:
   1. Desktop dropdown menus (Work / About / Connect)
   2. Outside-click + Escape closing
   3. Mobile navigation toggle
   4. Close menus on in-page link click
   5. Misc UI (footer year)
   ========================================================= */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     1. DESKTOP DROPDOWN MENUS
  ----------------------------------------------------------- */
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));

  function openMenu(item) {
    closeAllMenus();
    item.classList.add('is-open');
    var trigger = item.querySelector('.nav-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu(item) {
    item.classList.remove('is-open');
    var trigger = item.querySelector('.nav-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function closeAllMenus() {
    navItems.forEach(closeMenu);
  }

  navItems.forEach(function (item) {
    var trigger = item.querySelector('.nav-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = item.classList.contains('is-open');
      if (isOpen) {
        closeMenu(item);
      } else {
        openMenu(item);
      }
    });
  });

  /* -----------------------------------------------------------
     2. OUTSIDE-CLICK + ESCAPE CLOSING
  ----------------------------------------------------------- */
  document.addEventListener('click', function (event) {
    var clickedInsideNav = event.target.closest('.nav-item');
    if (!clickedInsideNav) {
      closeAllMenus();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllMenus();
      closeMobileMenu();
    }
  });

  /* -----------------------------------------------------------
     3. MOBILE NAVIGATION TOGGLE
  ----------------------------------------------------------- */
  var mobileToggle = document.getElementById('mobileToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    mobileToggle.classList.add('is-open');
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    mobileToggle.classList.remove('is-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  /* -----------------------------------------------------------
     4. CLOSE MENUS ON IN-PAGE LINK CLICK
  ----------------------------------------------------------- */
  document.querySelectorAll('[data-close-menus]').forEach(function (el) {
    el.addEventListener('click', function () {
      closeAllMenus();
      closeMobileMenu();
    });
  });

  /* -----------------------------------------------------------
     5. MISC UI
  ----------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------
     6. RESPONSIVE CUSTOM CURSOR
  ----------------------------------------------------------- */
  var supportsFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsFinePointer) {
    var cursorDot = document.querySelector('.cursor-dot');
    var cursorRing = document.querySelector('.cursor-ring');
    var root = document.documentElement;

    if (cursorDot && cursorRing) {
      root.classList.add('has-custom-cursor');

      var dotX = 0, dotY = 0, ringX = 0, ringY = 0;
      var mouseX = 0, mouseY = 0;

      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      });

      window.addEventListener('mouseleave', function () {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
      });

      window.addEventListener('mousedown', function () { root.classList.add('cursor-down'); });
      window.addEventListener('mouseup', function () { root.classList.remove('cursor-down'); });

      var interactiveSelector = 'a, button, .btn, .dock-item, .nav-trigger, .page-nav-dot, input, textarea, [role="menuitem"]';

      document.addEventListener('mouseover', function (e) {
        if (e.target.closest(interactiveSelector)) {
          root.classList.add('cursor-hover');
        }
      });

      document.addEventListener('mouseout', function (e) {
        if (e.target.closest(interactiveSelector)) {
          root.classList.remove('cursor-hover');
        }
      });

      function renderCursor() {
        dotX += (mouseX - dotX) * 0.9;
        dotY += (mouseY - dotY) * 0.9;
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        cursorDot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';
        cursorRing.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';

        requestAnimationFrame(renderCursor);
      }
      requestAnimationFrame(renderCursor);
    }
  }

  /* -----------------------------------------------------------
     7. FLOATING ACTION DOCK — hide on scroll down, show on scroll up
  ----------------------------------------------------------- */
  var actionDock = document.getElementById('actionDock');
  if (actionDock) {
    var lastScrollY = window.scrollY;
    var scrollTicking = false;

    function handleDockScroll() {
      var currentY = window.scrollY;
      var scrolledDown = currentY > lastScrollY && currentY > 160;
      actionDock.classList.toggle('is-hidden', scrolledDown);
      lastScrollY = currentY;
      scrollTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        requestAnimationFrame(handleDockScroll);
        scrollTicking = true;
      }
    });
  }

  /* -----------------------------------------------------------
     8. PAGE / SECTION DOT NAV + SCROLL-REVEAL ("pages")
  ----------------------------------------------------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main .section[id]'));
  var pageDots = Array.prototype.slice.call(document.querySelectorAll('.page-nav-dot'));

  function setActiveDot(id) {
    pageDots.forEach(function (dot) {
      dot.classList.toggle('is-active', dot.getAttribute('data-page-dot') === id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveDot(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(function (section) {
      revealObserver.observe(section);
      activeObserver.observe(section);
    });
  } else {
    sections.forEach(function (section) {
      section.classList.add('is-visible');
    });
  }
})();