// js/script.js
// Interactividad: menú, animaciones por scroll, validación del formulario, año dinámico.
// Comentarios incluidos.

/* ====== Helpers ====== */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ====== Nav toggle (mobile) ====== */
const navToggle = qs('#navToggle');
const navList = qs('#navList');

navToggle && navToggle.addEventListener('click', () => {
  if (navList.style.display === 'block') {
    navList.style.display = '';
    navToggle.setAttribute('aria-expanded', 'false');
  } else {
    navList.style.display = 'block';
    navToggle.setAttribute('aria-expanded', 'true');
  }
});

/* Close mobile menu when click a link */
qsa('.nav-link').forEach(link =>
  link.addEventListener('click', () => {
    if (window.innerWidth <= 680) navList.style.display = '';
  })
);

/* ====== Smooth header shrink on scroll (subtle) ====== */
const header = qs('.site-header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const sc = window.scrollY;
  if (sc > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
  lastScroll = sc;
});

/* ====== Animate elements into view (IntersectionObserver) ====== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // if you want them to animate only once:
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

qsa('.animate-appear').forEach(el => observer.observe(el));

/* ====== Skills bars animation ====== */
function animateSkillBars() {
  qsa('.skill-fill').forEach(fill => {
    const level = fill.getAttribute('data-level') || 0;
    // small timeout for stagger effect
    setTimeout(() => {
      fill.style.width = level + '%';
    }, 200);
  });
}
// Trigger skills when they appear
const skillsSection = qs('#skills');
if (skillsSection) {
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateSkillBars();
        skillsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  skillsObserver.observe(skillsSection);
}

/* ====== Contact form validation (client-side) ====== */
const form = qs('#contactForm');
const formMessage = qs('#formMessage');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const message = qs('#message').value.trim();
    // simple validations
    if (name.length < 2) {
      showMsg('Por favor ingresa tu nombre (mínimo 2 caracteres).', true);
      return;
    }
    if (!validateEmail(email)) {
      showMsg('Por favor ingresa un correo electrónico válido.', true);
      return;
    }
    if (message.length < 10) {
      showMsg('El mensaje debe tener al menos 10 caracteres.', true);
      return;
    }

    // Simulación de envío: aquí podrías integrar fetch a un endpoint
    showMsg('Mensaje enviado correctamente. ¡Gracias! Responderé pronto.', false);
    form.reset();
  });
}

// email regex helper
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMsg(text, isError = false) {
  formMessage.textContent = text;
  formMessage.style.color = isError ? '#ff8a8a' : '#a8ffde';
  setTimeout(() => {
    formMessage.textContent = '';
  }, 6000);
}

/* ====== Dynamic year in footer ====== */
const yearEl = qs('#currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ====== Small accessibility helpers: keyboard escape to close mobile menu ====== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && window.innerWidth <= 680) {
    if (navList.style.display === 'block') navList.style.display = '';
  }
});