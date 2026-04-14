(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const pageName = document.body.dataset.page || 'home';
  document.querySelectorAll(`.primary-nav a[data-page="${pageName}"]`).forEach((a) => a.classList.add('active'));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const today = new Date().toISOString().split('T')[0];
  const checkin = document.querySelector('input[name="checkin"]');
  const checkout = document.querySelector('input[name="checkout"]');
  if (checkin) checkin.min = today;
  if (checkout) checkout.min = today;

  function setError(field, message) {
    const wrapper = field.closest('label');
    const output = wrapper ? wrapper.querySelector('.error') : null;
    if (output) output.textContent = message;
  }

  function clearErrors(form) {
    form.querySelectorAll('.error').forEach((node) => (node.textContent = ''));
  }

  const bookingForm = document.getElementById('booking-form');
  const bookingFeedback = document.getElementById('booking-feedback');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearErrors(bookingForm);
      if (bookingFeedback) bookingFeedback.textContent = '';

      const data = new FormData(bookingForm);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const email = String(data.get('email') || '').trim();
      const checkinValue = String(data.get('checkin') || '').trim();
      const checkoutValue = String(data.get('checkout') || '').trim();
      const guests = String(data.get('guests') || '').trim();
      const room = String(data.get('room') || '').trim();
      const notes = String(data.get('notes') || '').trim();

      let valid = true;
      if (name.length < 2) {
        setError(bookingForm.elements.name, 'Please enter your full name.');
        valid = false;
      }
      if (phone.length < 10) {
        setError(bookingForm.elements.phone, 'Please enter a valid phone number.');
        valid = false;
      }
      if (!email.includes('@')) {
        setError(bookingForm.elements.email, 'Please enter a valid email address.');
        valid = false;
      }
      if (!checkinValue) {
        setError(bookingForm.elements.checkin, 'Please choose a check-in date.');
        valid = false;
      }
      if (!checkoutValue) {
        setError(bookingForm.elements.checkout, 'Please choose a check-out date.');
        valid = false;
      }
      if (checkinValue && checkoutValue && checkinValue >= checkoutValue) {
        setError(bookingForm.elements.checkout, 'Check-out must be after check-in.');
        valid = false;
      }
      if (!guests) {
        setError(bookingForm.elements.guests, 'Please select number of guests.');
        valid = false;
      }
      if (!room) {
        setError(bookingForm.elements.room, 'Please choose a room type.');
        valid = false;
      }

      if (!valid) return;

      const text = encodeURIComponent(
        `Hello Light Spring Hotel, I want to check availability.%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}%0ACheck-in: ${checkinValue}%0ACheck-out: ${checkoutValue}%0AGuests: ${guests}%0ARoom: ${room}%0ANotes: ${notes || 'None'}`
      );

      if (bookingFeedback) {
        bookingFeedback.textContent = 'Inquiry ready. Opening WhatsApp to complete your request...';
      }

      window.open(`https://wa.me/2348118620454?text=${text}`, '_blank', 'noopener');
      bookingForm.reset();
    });
  }

  const contactForm = document.getElementById('contact-form');
  const contactFeedback = document.getElementById('contact-feedback');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (name.length < 2 || !email.includes('@') || message.length < 8) {
        if (contactFeedback) contactFeedback.textContent = 'Please complete all fields correctly.';
        return;
      }

      const mailto = `mailto:info@lightspringhotels.online?subject=${encodeURIComponent('Website Inquiry from ' + name)}&body=${encodeURIComponent(message + '\n\nReply to: ' + email)}`;
      if (contactFeedback) contactFeedback.textContent = 'Opening your email app to send inquiry...';
      window.location.href = mailto;
      contactForm.reset();
    });
  }

  document.querySelectorAll('#year').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
