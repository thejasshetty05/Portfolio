document.addEventListener('DOMContentLoaded', () => {
  initDropdownNav();
  initMobileNav();
  initProjectSliders();
  initLightbox();
});

/**
 * Primary Navigation: Dropdown states & Escape key dismiss
 */
function initDropdownNav() {
  const dropdownParents = document.querySelectorAll('.has-dropdown');

  dropdownParents.forEach(item => {
    const trigger = item.querySelector('.nav-link');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = item.classList.contains('active');

      // Close all active menus
      dropdownParents.forEach(el => {
        el.classList.remove('active');
        el.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Global click & Escape key listener
  document.addEventListener('click', () => {
    dropdownParents.forEach(el => {
      el.classList.remove('active');
      el.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownParents.forEach(el => {
        el.classList.remove('active');
        el.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/**
 * Mobile Navigation: Toggle Drawer
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.primary-nav');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });
}

/**
 * Multi-Instance Project Sliders: Encapsulated carousel logic
 */
function initProjectSliders() {
  const sliders = document.querySelectorAll('[data-slider]');

  sliders.forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slider-slide');
    const prevBtn = slider.querySelector('.slider-btn.prev');
    const nextBtn = slider.querySelector('.slider-btn.next');
    const counter = slider.querySelector('.slider-counter');

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlider(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));
    }
  });
}

/**
 * Universal Modal / Lightbox for Saga and Hero cluster items
 */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = modal?.querySelector('.modal-close');
  const backdrop = modal?.querySelector('.modal-backdrop');

  if (!modal) return;

  const clickableItems = document.querySelectorAll('.cluster-item, .saga-card');

  clickableItems.forEach(item => {
    const trigger = () => {
      const caption = item.getAttribute('data-caption') || 'MEDIA PREVIEW';
      if (modalCaption) modalCaption.textContent = caption;
      modal.setAttribute('open', 'true');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    item.addEventListener('click', trigger);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

  function closeModal() {
    modal.removeAttribute('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}