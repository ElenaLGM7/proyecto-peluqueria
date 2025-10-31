from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Servicio(Base):
    __tablename__ = "servicios"
     __table_args__ = {'extend_existing': True}  # 👈 añade esta línea

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String)
    precio = Column(Float, nullable=False)

class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    nombre_cliente = Column(String, nullable=False)
    telefono = Column(String)
    fecha = Column(DateTime, default=datetime.utcnow)
    servicio_id = Column(Integer, ForeignKey("servicios.id"))

    servicio = relationship("Servicio")
