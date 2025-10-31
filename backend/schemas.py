from pydantic import BaseModel
from datetime import datetime

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


class CitaBase(BaseModel):
    nombre_cliente: str
    telefono: str | None = None
    servicio_id: int

class CitaCreate(CitaBase):
    pass

class Cita(CitaBase):
    id: int
    fecha: datetime
    servicio: Servicio
    class Config:
        orm_mode = True
