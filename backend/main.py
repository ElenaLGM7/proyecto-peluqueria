import sys
import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# --- 🔧 Asegurar que Python reconoce la carpeta 'backend' ---
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

# --- Importaciones internas ---
from backend.database import SessionLocal, engine, Base
from backend import crud, schemas, models

# --- Crear tablas si no existen ---
Base.metadata.create_all(bind=engine)

# --- Inicializar aplicación FastAPI ---
app = FastAPI(title="API Peluquería")

# --- Configurar CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Cambia esto por tu dominio en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependencia de base de datos ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Rutas principales ---
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

# 📅 Ver citas
@app.get("/citas", response_model=list[schemas.Cita])
def get_citas(db: Session = Depends(get_db)):
    return crud.get_citas(db)
