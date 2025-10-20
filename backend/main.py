from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
from models import Base, Reserva
from pydantic import BaseModel

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # luego puedes restringir al dominio de Netlify
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReservaSchema(BaseModel):
    nombre: str
    correo: str
    telefono: str = None
    fecha: str
    hora: str
    servicio: str

@app.post("/reservar")
def crear_reserva(reserva: ReservaSchema):
    db = SessionLocal()
    nueva_reserva = Reserva(
        nombre=reserva.nombre,
        correo=reserva.correo,
        telefono=reserva.telefono,
        fecha=reserva.fecha,
        hora=reserva.hora,
        servicio=reserva.servicio
    )
    db.add(nueva_reserva)
    db.commit()
    db.refresh(nueva_reserva)
    db.close()
    return {"message": f"Reserva creada para {reserva.nombre} el {reserva.fecha} a las {reserva.hora}"}
