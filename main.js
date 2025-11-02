// ----------------------------
// 🎯 CONFIGURACIÓN GENERAL
// ----------------------------
const form = document.getElementById('reservaForm');
const mensaje = document.getElementById('mensajeConfirmacion');
const servicesContainer = document.getElementById('services-container');
const totalElemento = document.getElementById('total');
let total = 0;

// ⚙️ URL del backend
const API_BASE = "https://proyecto-peluqueria.onrender.com";

// ----------------------------
// ✂️ CARGAR SERVICIOS DESDE BACKEND
// ----------------------------
async function cargarServicios() {
  try {
    const res = await fetch(`${API_BASE}/servicios`);
    if (!res.ok) throw new Error("No se pudieron cargar los servicios");

    const servicios = await res.json();
    servicesContainer.innerHTML = "";

    servicios.forEach(servicio => {
      const card = document.createElement("div");
      card.className = "service-card";

      card.innerHTML = `
        <h3 class="service-title">${servicio.nombre}</h3>
        <p class="service-desc">${servicio.descripcion || ""}</p>
        <div class="service-price">${servicio.precio.toFixed(2)} €</div>
        <label style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:14px;">
          <input type="checkbox" data-precio="${servicio.precio}" data-nombre="${servicio.nombre}" class="service-check">
          Añadir al total
        </label>
      `;
      servicesContainer.appendChild(card);
    });

    // Añadir total
    const totalBox = document.createElement("div");
    totalBox.className = "service-card";
    totalBox.style.background = "var(--soft)";
    totalBox.style.fontWeight = "600";
    totalBox.innerHTML = `
      <h3 class="service-title">Total estimado</h3>
      <div id="total-precio" class="service-price">0.00 €</div>
    `;
    servicesContainer.appendChild(totalBox);

    // Activar checkboxes
    const checkboxes = document.querySelectorAll(".service-check");
    checkboxes.forEach(chk => chk.addEventListener("change", actualizarTotal));
  } catch (error) {
    servicesContainer.innerHTML = `<p class="error">Error al cargar los servicios. Inténtalo más tarde.</p>`;
  }
}

// ----------------------------
// 💰 CALCULAR TOTAL
// ----------------------------
function actualizarTotal() {
  const seleccionados = document.querySelectorAll(".service-check:checked");
  let total = 0;
  seleccionados.forEach(chk => total += parseFloat(chk.dataset.precio));
  document.getElementById("total-precio").textContent = total.toFixed(2) + " €";
  totalElemento.textContent = total.toFixed(2) + " €";
}

// ----------------------------
// 📅 ENVIAR FORMULARIO DE CITA
// ----------------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const seleccionados = Array.from(document.querySelectorAll(".service-check:checked"))
    .map(chk => chk.dataset.nombre)
    .join(", ");

  if (!seleccionados) {
    mostrarMensaje("Por favor selecciona al menos un servicio.", "error");
    return;
  }

  const datosCita = {
    nombre_cliente: form.nombre.value,
    correo: form.correo.value,
    telefono: form.telefono.value,
    fecha: form.fecha.value,
    hora: form.hora.value,
    servicio: seleccionados
  };

  try {
    const res = await fetch(`${API_BASE}/citas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosCita)
    });

    if (!res.ok) throw new Error("Error en la reserva");

    await res.json();
    mostrarMensaje("✅ ¡Reserva realizada correctamente!", "ok");

    form.reset();
    document.querySelectorAll(".service-check:checked").forEach(chk => chk.checked = false);
    actualizarTotal();

  } catch (error) {
    mostrarMensaje("❌ No se pudo conectar con el servidor. Intenta más tarde.", "error");
  }
});

// ----------------------------
// 💬 MENSAJE VISUAL
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
document.addEventListener("DOMContentLoaded", () => {
  cargarServicios();
  actualizarTotal();
});
