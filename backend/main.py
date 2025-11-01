import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from . import crud, schemas, models

# Crear las tablas en la base de datos (si no existen)
Base.metadata.create_all(bind=engine)

# Inicialización de la aplicación FastAPI
app = FastAPI(title="API Peluquería")

# Configuración de CORS (permite conexión con el frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://brilloyestilosalondebelleza.netlify.app/"],  # ⚠️ En producción, cambia "*" por el dominio de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# RUTAS PRINCIPALES
# -----------------------------

@app.get("/")
def read_root():
    return {"message": "API de Peluquería funcionando correctamente"}

# 🧾 Obtener lista de servicios
@app.get("/servicios", response_model=list[schemas.Servicio])
def get_servicios(db: Session = Depends(get_db)):
    return crud.get_servicios(db)

# ➕ Crear nuevo servicio
@app.post("/servicios", response_model=schemas.Servicio)
def create_servicio(servicio: schemas.ServicioCreate, db: Session = Depends(get_db)):
    return crud.create_servicio(db, servicio)

# ✂️ Crear nueva cita
@app.post("/citas", response_model=schemas.Cita)
def create_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    return crud.create_cita(db, cita)

from .utils import notify_new_booking

@app.post("/citas", response_model=schemas.Cita)
def create_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    nueva_cita = crud.create_cita(db, cita)
    notify_new_booking(cita.nombre, cita.correo, cita.servicio, cita.fecha, cita.hora)
    return nueva_cita

# 📅 Ver citas
@app.get("/citas", response_model=list[schemas.Cita])
def get_citas(db: Session = Depends(get_db)):
    return crud.get_citas(db)

# -----------------------------
# 🧪 Ruta temporal para probar el correo
# -----------------------------
from .utils import try_send_email

@app.get("/test_email")
def test_email():
    """
    Prueba temporal: intenta enviar un correo de prueba.
    Devuelve el resultado y posibles mensajes de error.
    """
    try:
        ok = try_send_email(
            subject="Prueba desde Render (API Peluquería)",
            body="Esto es un test automático para verificar la configuración SMTP.",
            to="tu_correo@gmail.com"  # ← pon aquí tu correo real
        )
        if ok:
            return {"status": "ok", "message": "Correo enviado correctamente ✅"}
        else:
            return {"status": "fail", "message": "No se pudo enviar el correo ❌ (ver logs en Render)"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
