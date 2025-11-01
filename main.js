// ----------------------------
// 🎯 CONFIGURACIÓN GENERAL
// ----------------------------
const form = document.getElementById('reservaForm');
const mensaje = document.getElementById('mensajeConfirmacion');
const listaServicios = document.getElementById('listaServicios');
const totalElemento = document.getElementById('total');
let total = 0;

// ⚙️ URL del backend (CÁMBIALA por tu dominio real en Render)
const API_BASE = "https://proyecto-peluqueria.onrender.com";

// ----------------------------
// ✂️ CARGAR SERVICIOS DISPONIBLES
// ----------------------------
async function cargarServicios() {
  try {
    const res = await fetch(`${API_BASE}/servicios`);
    if (!res.ok) throw new Error("No se pudieron cargar los servicios");

    const servicios = await res.json();
    listaServicios.innerHTML = "";

    servicios.forEach(servicio => {
      const item = document.createElement("li");
      item.classList.add("servicio-item");
      item.innerHTML = `
        <label>
          <input type="checkbox" value="${servicio.precio}" data-nombre="${servicio.nombre}">
          ${servicio.nombre} — ${servicio.precio.toFixed(2)} €
        </label>
      `;
      listaServicios.appendChild(item);
    });

    actualizarTotal();
  } catch (error) {
    listaServicios.innerHTML = `<p class="error">Error al cargar los servicios. Inténtalo más tarde.</p>`;
  }
}

// ----------------------------
// 💰 CALCULAR TOTAL
// ----------------------------
function actualizarTotal() {
  const checkboxes = listaServicios.querySelectorAll("input[type='checkbox']");
  total = 0;

  checkboxes.forEach(chk => {
    if (chk.checked) {
      total += parseFloat(chk.value);
    }
  });

  totalElemento.textContent = total.toFixed(2) + " €";
}

listaServicios.addEventListener("change", actualizarTotal);

// ----------------------------
// 📅 ENVIAR FORMULARIO DE CITA
// ----------------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener servicios seleccionados
  const seleccionados = Array.from(listaServicios.querySelectorAll("input:checked"))
    .map(chk => chk.dataset.nombre)
    .join(", ");

  if (!seleccionados) {
    mostrarMensaje("Por favor selecciona al menos un servicio.", "error");
    return;
  }

  const datosCita = {
    nombre: form.nombre.value,
    correo: form.correo.value,
    telefono: form.telefono.value,
    fecha: form.fecha.value,
    hora: form.hora.value,
    servicio: seleccionados
  };

  try {
    const res = await fetch(`${API_BASE}/citas`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosCita)
    });

    if (!res.ok) throw new Error("Error en la reserva");

    const data = await res.json();
    mostrarMensaje("✅ ¡Reserva realizada correctamente!", "ok");
    form.reset();
    listaServicios.querySelectorAll("input:checked").forEach(chk => chk.checked = false);
    actualizarTotal();

  } catch (error) {
    mostrarMensaje("❌ No se pudo conectar con el servidor. Intenta más tarde.", "error");
  }
});

// ----------------------------
// 💬 FUNCIÓN DE MENSAJE VISUAL
// ----------------------------
function mostrarMensaje(texto, tipo) {
  mensaje.style.display = "block";
  mensaje.textContent = texto;

  if (tipo === "ok") {
    mensaje.style.background = "#c0ffc0";
    mensaje.style.color = "#006400";
  } else {
    mensaje.style.background = "#ffc0c0";
    mensaje.style.color = "#800000";
  }

  setTimeout(() => mensaje.style.display = "none", 3500);
}

// ----------------------------
// 🚀 INICIALIZACIÓN
// ----------------------------
document.addEventListener("DOMContentLoaded", cargarServicios);
