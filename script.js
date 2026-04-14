const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

const sectionIds = ['rooms', 'amenities', 'offers', 'contact'];
const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

const updateActiveNav = () => {
  const scrollPoint = window.scrollY + 120;
  let current = '';

  sections.forEach((section) => {
    if (scrollPoint >= section.offsetTop) current = section.id;
  });

  if (!current) return;

  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
    const target = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', target === current);
  });
};

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const bookingForm = document.getElementById('booking-form');
const feedback = document.getElementById('form-feedback');

if (bookingForm && feedback) {
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const guests = document.getElementById('guests');
  const roomType = document.getElementById('roomType');

  const today = new Date().toISOString().split('T')[0];
  checkin.min = today;

  checkin.addEventListener('change', () => {
    checkout.min = checkin.value || today;
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    feedback.className = 'form-feedback';

    const inDate = checkin.value;
    const outDate = checkout.value;

    if (!inDate || !outDate || !guests.value || !roomType.value) {
      feedback.textContent = 'Please complete all booking fields.';
      feedback.classList.add('error');
      return;
    }

    if (new Date(outDate) <= new Date(inDate)) {
      feedback.textContent = 'Check-out date must be after check-in date.';
      feedback.classList.add('error');
      return;
    }

    const message = `Hello Light Spring Hotel, I want to check availability.%0A` +
      `Check-in: ${inDate}%0A` +
      `Check-out: ${outDate}%0A` +
      `Guests: ${guests.value}%0A` +
      `Room Type: ${roomType.value}`;

    feedback.textContent = 'Great! Redirecting you to WhatsApp to complete your reservation inquiry.';
    feedback.classList.add('success');

    setTimeout(() => {
      window.open(`https://wa.me/2348118620454?text=${message}`, '_blank', 'noopener,noreferrer');
    }, 450);
  });
}

const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());
