# models.py
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, nullable=False)
    fecha = Column(String, nullable=False)
    hora = Column(String, nullable=False)
    mensaje = Column(String, nullable=True)
    creada_en = Column(DateTime, default=datetime.utcnow)
