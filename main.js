/* main.js - frontend booking logic
   IMPORTANT: cambia API_BASE por la URL de tu backend FastAPI desplegado.
   Ejemplo: const API_BASE = "https://peluqueria-backend.up.railway.app";
*/
const API_BASE = window.API_BASE || "https://YOUR_BACKEND_URL"; // <--- cambia esto

// Servicios fijos que pediste
const SERVICES = [
  { id: "corte", title: "Corte", price: 25, duration: 30 },
  { id: "tinte", title: "Tinte", price: 50, duration: 60 },
  { id: "mechas", title: "Mechas", price: 80, duration: 90 },
  { id: "peinado", title: "Peinado", price: 35, duration: 45 }
];

const serviceSelect = document.getElementById("serviceSelect");
const dateInput = document.getElementById("dateInput");
const timeSelect = document.getElementById("timeSelect");
const form = document.getElementById("form-cita");
const formMsg = document.getElementById("form-msg");

// rellena select de servicios
function initServices(){
  SERVICES.forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = `${s.title} — ${s.price} €`;
    serviceSelect.appendChild(opt);
  });
}
initServices();

// limitar fecha mínima a hoy
function setDateMin(){
  const today = new Date();
  const iso = today.toISOString().slice(0,10);
  dateInput.min = iso;
  dateInput.value = iso;
}
setDateMin();

// helpers de tiempo
function timeToMinutes(t){ const [hh,mm] = t.split(":").map(Number); return hh*60+mm; }
function minutesToTime(m){ const hh = Math.floor(m/60).toString().padStart(2,"0"); const mm = (m%60).toString().padStart(2,"0"); return `${hh}:${mm}`; }

// genera slots cada 30 minutos entre 10:00 y 19:00 (ajustable)
function generateSlots(interval = 30, duration = 30){
  const open = timeToMinutes("10:00");
  const close = timeToMinutes("19:00");
  const slots = [];
  for(let t=open; t+duration<=close; t+=interval) slots.push(minutesToTime(t));
  return slots;
}

// obtiene reservas de la API para una fecha
async function fetchBookingsForDate(dateStr){
  try{
    const res = await fetch(`${API_BASE}/api/bookings?date=${dateStr}`);
    if(!res.ok) throw new Error("API error");
    return await res.json(); // array de bookings
  }catch(err){
    console.warn("No se pudo obtener reservas del backend:", err);
    return []; // fallback: vacío
  }
}

// marca las horas disponibles según servicio y reservas existentes
async function populateTimeOptions(){
  timeSelect.innerHTML = "";
  const date = dateInput.value;
  if(!date){ timeSelect.innerHTML = '<option value="">Selecciona una fecha</option>'; return; }
  const service = SERVICES.find(s => s.id === serviceSelect.value);
  if(!service){ timeSelect.innerHTML = '<option value="">Selecciona servicio</option>'; return; }

  // generar slots con intervalo 30 min; se podría hacer dinámico
  const slots = generateSlots(30, service.duration);
  // obtener reservas ya tomadas en esa fecha
  const bookings = await fetchBookingsForDate(date); // bookings con fields: time, service, duration? backend devuelve time & service
  function isOverlapping(startTime){
    const start = timeToMinutes(startTime);
    for(const b of bookings){
      const bStart = timeToMinutes(b.time);
      // deducir duración del servicio reservado en b.service
      const booked = SERVICES.find(s => s.id === b.service);
      const bDur = booked ? booked.duration : 60;
      const bEnd = bStart + bDur;
      const end = start + service.duration;
      if(start < bEnd && bStart < end) return true;
    }
    return false;
  }

  // render slots
  slots.forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    if(isOverlapping(s)){
      opt.disabled = true;
      opt.textContent = `${s} — ocupado`;
    }
    timeSelect.appendChild(opt);
  });

  // si no quedan slots, mostrar mensaje
  if(!timeSelect.querySelector("option:not([disabled])")){
    timeSelect.innerHTML = '<option value="">No hay huecos disponibles</option>';
  }
}

// eventos
dateInput.addEventListener("change", populateTimeOptions);
serviceSelect.addEventListener("change", populateTimeOptions);

// submit
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  formMsg.textContent = "";
  const formData = new FormData(form);
  const payload = {
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    email: formData.get("email")?.trim() || null,
    service: formData.get("service"),
    date: formData.get("date"),
    time: formData.get("time"),
    notes: formData.get("notes")?.trim() || null
  };

  // validación básica
  if(!payload.name || !payload.phone || !payload.service || !payload.date || !payload.time){
    formMsg.style.color = "crimson";
    formMsg.textContent = "Por favor rellena los campos obligatorios.";
    return;
  }

  try{
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if(res.status === 201){
      const json = await res.json();
      formMsg.style.color = "green";
      formMsg.textContent = "✅ Tu cita ha sido reservada correctamente.";
      form.reset();
      setDateMin(); // vuelve a poner fecha mínima a hoy
      // refrescar slots para que aparezca ocupado el hueco reservado
      await populateTimeOptions();
    } else if(res.status === 409){
      const j = await res.json();
      formMsg.style.color = "crimson";
      formMsg.textContent = "⚠️ Ese hueco ya está ocupado. Elige otro horario.";
      await populateTimeOptions(); // refresca disponibilidad
    } else {
      const j = await res.json();
      formMsg.style.color = "crimson";
      formMsg.textContent = j?.detail || "Error al enviar la reserva.";
    }
  }catch(err){
    console.error("Error al enviar reserva:", err);
    formMsg.style.color = "crimson";
    formMsg.textContent = "Error de conexión con el servidor. Intenta más tarde.";
  }
});

// init
document.getElementById("year").textContent = new Date().getFullYear();
populateTimeOptions(); // inicial (usa fecha por defecto)
