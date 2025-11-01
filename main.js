const form = document.getElementById('reservaForm');
const mensaje = document.getElementById('mensajeConfirmacion');

// ---- CONFIG ----
const API_BASE = window.API_BASE || "https://proyecto-peluqueria.onrender.com/"; // <--- cambia aquí por tu URL real
// ---- CONFIG ----
const BACKEND_URL = "https://proyecto-peluqueria.onrender.com/reservas";

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const datosCita = {
    nombre: form.nombre.value,
    correo: form.correo.value,
    telefono: form.telefono.value,
    fecha: form.fecha.value,
    hora: form.hora.value,
    servicio: form.servicio.value
  };

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosCita)
    });

    if (!res.ok) throw new Error("Error en la reserva");

    const data = await res.json();
    mensaje.style.display = "block";
    mensaje.style.background = "#c0ffc0";
    mensaje.style.color = "#006400";
    mensaje.textContent = data.message;
    form.reset();

    setTimeout(() => {
      mensaje.style.display = "none";
    }, 3000);

  } catch (error) {
    mensaje.style.display = "block";
    mensaje.style.background = "#ffc0c0";
    mensaje.style.color = "#800000";
    mensaje.textContent = "No se pudo conectar con el servidor. Intenta más tarde.";
  }
});
