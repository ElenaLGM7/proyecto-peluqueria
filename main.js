const form = document.getElementById('reservaForm');
const mensaje = document.getElementById('mensajeConfirmacion');
const listaServicios = document.getElementById('listaServicios');
const totalElemento = document.getElementById('total-precio');
let total = 0;

// Lista de servicios estática (como antes)
const servicios = [
  { nombre: "Corte de cabello", precio: 25 },
  { nombre: "Tinte completo", precio: 50 },
  { nombre: "Peinado", precio: 30 },
  { nombre: "Manicura", precio: 20 },
  { nombre: "Tratamiento capilar", precio: 35 },
  { nombre: "Depilación facial", precio: 15 }
];

// ----------------------------
// Cargar servicios en la página
// ----------------------------
function cargarServicios() {
  listaServicios.innerHTML = "";
  servicios.forEach(s => {
    const item = document.createElement("li");
    item.classList.add("servicio-item");
    item.innerHTML = `
      <label>
        <input type="checkbox" value="${s.precio}" data-nombre="${s.nombre}">
        ${s.nombre} — ${s.precio.toFixed(2)} €
      </label>
    `;
    listaServicios.appendChild(item);
  });
  actualizarTotal();
}

function actualizarTotal() {
  const checkboxes = listaServicios.querySelectorAll("input[type='checkbox']");
  total = 0;
  checkboxes.forEach(chk => {
    if (chk.checked) total += parseFloat(chk.value);
  });
  totalElemento.textContent = total.toFixed(2) + " €";
}

listaServicios.addEventListener("change", actualizarTotal);

// ----------------------------
// Enviar formulario vía Formspree
// ----------------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const seleccionados = Array.from(listaServicios.querySelectorAll("input:checked"))
    .map(chk => chk.dataset.nombre)
    .join(", ");

  if (!seleccionados) {
    mostrarMensaje("Por favor selecciona al menos un servicio.", "error");
    return;
  }

  const formData = new FormData(form);
  formData.append("Servicios seleccionados", seleccionados);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      mostrarMensaje("✅ ¡Reserva realizada correctamente!", "ok");
      form.reset();
      listaServicios.querySelectorAll("input:checked").forEach(chk => chk.checked = false);
      actualizarTotal();
    } else {
      mostrarMensaje("❌ No se pudo enviar el formulario. Intenta más tarde.", "error");
    }
  } catch (err) {
    mostrarMensaje("❌ No se pudo conectar con el servidor.", "error");
  }
});

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

document.addEventListener("DOMContentLoaded", cargarServicios);
