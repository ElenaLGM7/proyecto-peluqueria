from sqlalchemy import Column, Integer, String
from database import Base

class Reserva(Base):
    __tablename__ = "reservas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    correo = Column(String, nullable=False)
    telefono = Column(String, nullable=True)
    fecha = Column(String, nullable=False)
    hora = Column(String, nullable=False)
    servicio = Column(String, nullable=False)
