// Multilenguaje
const translations = {
  es: {
    contact: "Contacto",
    send: "Enviar",
    book: "Reserva tu cita",
    bookNow: "Reservar"
  },
  en: {
    contact: "Contact",
    send: "Send",
    book: "Book your appointment",
    bookNow: "Book Now"
  }
};

const userLang = localStorage.getItem('lang') || 'es';

document.querySelectorAll('[data-lang]').forEach(el => {
  const key = el.getAttribute('data-lang');
  el.textContent = translations[userLang][key];
});

// Formulario de contacto
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: contactForm.name.value,
    email: contactForm.email.value,
    message: contactForm.message.value
  };

  try {
    const res = await fetch('https://belleza-studio-backend.onrender.com/api/contact', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message);
    contactForm.reset();
  } catch (err) {
    alert("Error al enviar el mensaje");
  }
});

// Formulario de reservas
const bookingForm = document.getElementById('booking-form');
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: bookingForm.name.value,
    email: bookingForm.email.value,
    phone: bookingForm.phone.value,
    service: bookingForm.service.value,
    date: bookingForm.date.value,
    time: bookingForm.time.value
  };

  try {
    const res = await fetch('https://belleza-studio-backend.onrender.com/api/book', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message);
    bookingForm.reset();
  } catch (err) {
    alert("Error al reservar la cita");
  }
});
