# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Date, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Conexión con Neon (asegúrate de poner tu URL en .env)
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo de reserva
class Reserva(Base):
    __tablename__ = "reservas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    correo = Column(String, nullable=False)
    telefono = Column(String)
    fecha = Column(String, nullable=False)
    hora = Column(String, nullable=False)
    servicio = Column(String, nullable=False)

Base.metadata.create_all(bind=engine)

# Modelo Pydantic para recibir datos
class ReservaCreate(BaseModel):
    nombre: str
    correo: str
    telefono: str = None
    fecha: str
    hora: str
    servicio: str

app = FastAPI()

# CORS: permitir solo tu frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://brilloyestilosalondebelleza.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/reservar")
def crear_reserva(reserva: ReservaCreate):
    db = SessionLocal()
    nueva = Reserva(
        nombre=reserva.nombre,
        correo=reserva.correo,
        telefono=reserva.telefono,
        fecha=reserva.fecha,
        hora=reserva.hora,
        servicio=reserva.servicio
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    db.close()
    return {"message": "Reserva registrada correctamente!"}

