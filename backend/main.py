from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import crud, schemas, models  # 👈 sin el prefijo "backend."

# Crear las tablas en la base de datos (si no existen)
Base.metadata.create_all(bind=engine)

# Inicialización de la aplicación FastAPI
app = FastAPI(title="API Peluquería")

# Configuración de CORS (permite conexión con el frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ En producción, cambia "*" por el dominio de tu frontend
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

# 📅 Ver citas
@app.get("/citas", response_model=list[schemas.Cita])
def get_citas(db: Session = Depends(get_db)):
    return crud.get_citas(db)
