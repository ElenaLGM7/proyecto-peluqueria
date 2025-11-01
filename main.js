// ==============================
// CONFIGURACIÓN GENERAL
// ==============================
const API_BASE = window.API_BASE || "https://proyecto-peluqueria.onrender.com/"; // ← cambia esta URL por la tuya real

// ==============================
// FORMULARIO DE RESERVA
// ==============================
const form = document.getElementById('booking-form');
const mensaje = document.getElementById('booking-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const datosCita = {
    nombre: form.nombre.value,
    correo: form.correo.value,
    servicio: form.servicio.value,
    fecha: form.fecha.value,
    hora: form.hora.value
  };

  try {
    const res = await fetch(`${API_BASE}/citas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosCita)
    });

    if (!res.ok) throw new Error("Error en la reserva");
    const data = await res.json();

    mensaje.hidden = false;
    mensaje.textContent = "✅ Cita registrada correctamente.";
    mensaje.style.background = "#c0ffc0";
    mensaje.style.color = "#004000";

    setTimeout(() => {
      mensaje.hidden = true;
    }, 4000);

    form.reset();
  } catch (err) {
    mensaje.hidden = false;
    mensaje.textContent = "❌ Error al conectar con el servidor.";
    mensaje.style.background = "#ffc0c0";
    mensaje.style.color = "#800000";
  }
});

// ==============================
// SERVICIOS Y PRECIOS
// ==============================
const servicesContainer = document.getElementById('services-container');

// Lista de servicios base (si no quieres depender del backend)
const servicios = [
  { nombre: "Corte de cabello", descripcion: "Adaptado a tu estilo y forma de rostro.", precio: 25 },
  { nombre: "Tinte completo", descripcion: "Coloración profesional y tratamiento de acabado.", precio: 50 },
  { nombre: "Peinado", descripcion: "Peinados para eventos y ocasiones especiales.", precio: 30 },
  { nombre: "Manicura", descripcion: "Cuidado y esmaltado profesional.", precio: 20 },
  { nombre: "Tratamiento capilar", descripcion: "Repara y nutre en profundidad.", precio: 35 },
  { nombre: "Depilación facial", descripcion: "Definición y limpieza de cejas y labio.", precio: 15 }
];

// Generar dinámicamente el listado de servicios
function renderServicios() {
  servicesContainer.innerHTML = "";

  servicios.forEach((servicio, index) => {
    const card = document.createElement("article");
    card.className = "service-card";

    card.innerHTML = `
      <h3 class="service-title">${servicio.nombre}</h3>
      <p class="service-desc">${servicio.descripcion}</p>
      <div class="service-price">${servicio.precio.toFixed(2)} €</div>
      <label style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:14px;">
        <input type="checkbox" data-precio="${servicio.precio}" class="service-check">
        Añadir al total
      </label>
    `;

    servicesContainer.appendChild(card);
  });

  // Añadir el elemento del total
  const totalBox = document.createElement("div");
  totalBox.className = "service-card";
  totalBox.style.background = "var(--soft)";
  totalBox.style.fontWeight = "600";
  totalBox.innerHTML = `
    <h3 class="service-title">Total estimado</h3>
    <div id="total-precio" class="service-price">0.00 €</div>
  `;
  servicesContainer.appendChild(totalBox);

  // Activar los checkboxes
  const checkboxes = document.querySelectorAll(".service-check");
  checkboxes.forEach(chk => chk.addEventListener("change", actualizarTotal));
}

// Calcular total
function actualizarTotal() {
  const seleccionados = document.querySelectorAll(".service-check:checked");
  let total = 0;
  seleccionados.forEach(chk => total += parseFloat(chk.dataset.precio));
  document.getElementById("total-precio").textContent = total.toFixed(2) + " €";
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", renderServicios);
