# backend/app/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import date, time

# -------- SERVICIOS --------
class ServicioBase(BaseModel):
    nombre: str
    descripcion: str | None = None
    precio: float

class ServicioCreate(ServicioBase):
    pass

class Servicio(ServicioBase):
    id: int
    class Config:
        orm_mode = True


# -------- CITAS --------
class CitaBase(BaseModel):
    nombre: str
    correo: EmailStr
    telefono: str
    fecha: date
    hora: time
    servicio: str

class CitaCreate(CitaBase):
    pass

class Cita(CitaBase):
    id: int
    class Config:
        orm_mode = True
