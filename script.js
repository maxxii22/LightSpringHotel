document.documentElement.classList.add('js');

const bookingForm = document.querySelector('#booking-form');
const formMessage = document.querySelector('#form-message');
const yearNode = document.querySelector('#year');
const menuToggle = document.querySelector('#menu-toggle');
const siteHeader = document.querySelector('.site-header');
const menuLinks = document.querySelectorAll('#main-nav a');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && siteHeader) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    siteHeader.classList.toggle('menu-open', !isExpanded);
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteHeader.classList.remove('menu-open');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteHeader.classList.remove('menu-open');
    }
  });
}

if (bookingForm && formMessage) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const fullName = String(formData.get('fullName') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const checkIn = String(formData.get('checkIn') || '');
    const checkOut = String(formData.get('checkOut') || '');
    const guests = String(formData.get('guests') || '');
    const roomType = String(formData.get('roomType') || '');

    if (!fullName || !phone || !checkIn || !checkOut || !guests || !roomType) {
      formMessage.textContent = 'Please complete all required fields.';
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      formMessage.textContent = 'Check-out date must be after check-in date.';
      return;
    }

    formMessage.textContent = 'Thank you. Your inquiry has been received. We will contact you shortly.';
    bookingForm.reset();
  });
}

const revealTargets = document.querySelectorAll('.section .container, .card, .offer-card, .booking-form');
revealTargets.forEach((element) => element.classList.add('reveal'));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}

const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = [...document.querySelectorAll('main section[id]')];

if (navLinks.length && sections.length) {
  const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 140;
    let currentSectionId = sections[0].id;

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentSectionId}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}
