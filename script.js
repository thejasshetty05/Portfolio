const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const header = $('.site-header');
const menuToggle = $('.menu-toggle');
const nav = $('.primary-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', open);
});

$$('.primary-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.classList.remove('active');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.addEventListener('click', e => {
  if (nav?.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove('open');
    menuToggle.classList.remove('active');
  }
});

// Reveal sections as they enter the viewport.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => observer.observe(el));

// Independent project sliders.
$$('[data-slider]').forEach(project => {
  const slides = $$('.slide', project);
  const counter = $('.counter', project);
  let index = 0;

  const show = next => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  $('[data-prev]', project).addEventListener('click', () => show(index - 1));
  $('[data-next]', project).addEventListener('click', () => show(index + 1));
});

// Floating photo viewer. Add real image paths to data-image to activate it.
const modal = $('.modal');
const modalImage = $('img', modal);
const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalImage.removeAttribute('src');
};
$$('.photo').forEach(photo => {
  photo.addEventListener('click', () => {
    const src = photo.dataset.image;
    if (!src) return;
    modalImage.src = src;
    modalImage.alt = 'Personal photograph';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});
$('.modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Subtle cursor light on pointer devices.
const glow = $('.cursor-glow');
if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
} else {
  glow.style.display = 'none';
}

$('#year').textContent = new Date().getFullYear();

// Very subtle pointer parallax for the floating hero photographs.
const heroVisual = document.querySelector('.hero-visual');
const photos = [...document.querySelectorAll('.hero-visual .photo')];
if (heroVisual && window.matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('pointermove', e => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    photos.forEach((photo, i) => {
      const amount = (i + 1) * 5;
      photo.style.marginLeft = `${x * amount}px`;
      photo.style.marginTop = `${y * amount}px`;
    });
  });
  heroVisual.addEventListener('pointerleave', () => {
    photos.forEach(photo => {
      photo.style.marginLeft = '0px';
      photo.style.marginTop = '0px';
    });
  });
}
