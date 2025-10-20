/* main.js
   - Cambia API_BASE por la URL de tu backend FastAPI desplegado.
   - El backend debe exponer:
     GET  /api/bookings?date=YYYY-MM-DD       -> devuelve array de bookings [{time:"HH:MM", service:"corte", ...}, ...]
     POST /api/bookings                       -> recibe JSON con {name,phone,email,service,date,time,notes}
       -> devuelve 201 en éxito, 409 si el hueco ya está ocupado
*/

// ---- CONFIG ----
const API_BASE = window.API_BASE || "https://YOUR_BACKEND_URL"; // <--- cambia aquí por tu URL real

// Servicios fijos (coincidir con backend)
const SERVICES = [
  { id: "corte", title: "Corte", duration: 30, price: 25 },
  { id: "tinte", title: "Tinte", duration: 60, price: 50 },
  { id: "mechas", title: "Mechas", duration: 90, price: 80 },
  { id: "peinado", title: "Peinado", duration: 45, price: 35 }
];

// DOM
const serviceSelect = document.getElementById("serviceSelect");
const dateInput = document.getElementById("dateInput");
const timeSelect = document.getElementById("timeSelect");
const form = document.getElementById("form-cita");
const formMsg = document.getElementById("form-msg");
const confirmBox = document.getElementById("confirmBox");
const confirmText = document.getElementById("confirmText");
const confirmClose = document.getElementById("confirmClose");

// Init year
document.getElementById("year").textContent = new Date().getFullYear();

// Fill service options
function initServices(){
  serviceSelect.innerHTML = "<option value=''>Selecciona un servicio</option>";
  SERVICES.forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = `${s.title} — ${s.price} €`;
    serviceSelect.appendChild(opt);
  });
}
initServices();

// Fecha mínima = hoy
function setDateMin(){
  const today = new Date();
  const iso = today.toISOString().slice(0,10);
  dateInput.min = iso;
  dateInput.value = iso;
}
setDateMin();

// time helpers
function timeToMinutes(t){ const [hh,mm]=t.split(":").map(Number); return hh*60+mm; }
function minutesToTime(m){ const hh=Math.floor(m/60).toString().padStart(2,"0"); const mm=(m%60).toString().padStart(2,"0"); return `${hh}:${mm}`; }

// generate slots at 30-min intervals between 10:00 and 19:00, adjusted by service duration
function generateSlots(interval=30, duration=30){
  const open = timeToMinutes("10:00"), close = timeToMinutes("19:00");
  const arr=[];
  for(let t=open; t+duration<=close; t+=interval) arr.push(minutesToTime(t));
  return arr;
}

// fetch bookings for a date from backend
async function fetchBookings(dateStr){
  try{
    const res = await fetch(`${API_BASE}/api/bookings?date=${dateStr}`);
    if(!res.ok) throw new Error("API fetch failed");
    return await res.json();
  }catch(err){
    console.warn("fetchBookings failed:", err);
    return []; // fallback: treat as no bookings (so frontend still works)
  }
}

// determine overlapping bookings
function overlaps(startA, durA, startB, durB){
  const endA = startA + durA;
  const endB = startB + durB;
  return (startA < endB) && (startB < endA);
}

// populate timeSelect based on chosen date & service
async function populateTimes(){
  timeSelect.innerHTML = "";
  const date = dateInput.value;
  const serviceId = serviceSelect.value;
  if(!date){ timeSelect.innerHTML = "<option value=''>Selecciona fecha</option>"; return; }
  if(!serviceId){ timeSelect.innerHTML = "<option value=''>Selecciona servicio</option>"; return; }

  const service = SERVICES.find(s=>s.id===serviceId);
  const slots = generateSlots(30, service.duration);
  const bookings = await fetchBookings(date);

  function isTaken(slot){
    const s = timeToMinutes(slot);
    for(const b of bookings){
      const bStart = timeToMinutes(b.time);
      const bService = SERVICES.find(x=>x.id===b.service);
      const bDur = bService ? bService.duration : 60;
      if(overlaps(s, service.duration, bStart, bDur)) return true;
    }
    return false;
  }

  slots.forEach(slot=>{
    const opt = document.createElement("option");
    opt.value = slot;
    opt.textContent = slot;
    if(isTaken(slot)){
      opt.disabled = true;
      opt.textContent = `${slot} — ocupado`;
    }
    timeSelect.appendChild(opt);
  });

  // if no available options
  const anyAvailable = !!timeSelect.querySelector("option:not([disabled])");
  if(!anyAvailable){
    timeSelect.innerHTML = "<option value=''>No hay huecos disponibles</option>";
  }
}

// event listeners
dateInput.addEventListener("change", populateTimes);
serviceSelect.addEventListener("change", populateTimes);

// form submit
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  formMsg.textContent = "";
  confirmBox.hidden = true;

  const payload = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim() || null,
    service: form.service.value,
    date: form.date.value,
    time: form.time.value,
    notes: form.notes.value.trim() || null
  };

  // basic validation
  if(!payload.name || !payload.phone || !payload.service || !payload.date || !payload.time){
    formMsg.style.color = "crimson";
    formMsg.textContent = "Por favor completa los campos obligatorios (*)";
    return;
  }

  // submit to backend
  try{
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if(res.status === 201){
      const json = await res.json();
      // show elegant confirm box
      confirmText.textContent = `✅ Tu cita para ${payload.service} el ${payload.date} a las ${payload.time} ha sido reservada.`;
      confirmBox.hidden = false;
      // optionally show email info
      if(payload.email) confirmText.textContent += ` Hemos enviado la confirmación a ${payload.email}.`;
      form.reset();
      setDateMin();
      await populateTimes(); // refresh availability
    } else if(res.status === 409){
      const j = await res.json();
      formMsg.style.color = "crimson";
      formMsg.textContent = "Ese hueco ya está ocupado. Escoge otro horario.";
      await populateTimes();
    } else {
      const j = await res.json().catch(()=>({detail:"Error del servidor"}));
      formMsg.style.color = "crimson";
      formMsg.textContent = j.detail || "Error al enviar la reserva.";
    }
  }catch(err){
    console.error("Error sending booking:", err);
    formMsg.style.color = "crimson";
    formMsg.textContent = "No se pudo conectar con el servidor. Intenta más tarde.";
  }
});

// confirm box close
confirmClose.addEventListener("click", ()=>{ confirmBox.hidden = true; });

// initial populate
populateTimes();
