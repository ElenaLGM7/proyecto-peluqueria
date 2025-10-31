from sqlalchemy import Column, Integer, String, Text
from database import Base


class Servicio(Base):
    __tablename__ = "servicios"
    __table_args__ = {'extend_existing': True}  # ✅ evita conflictos si ya existe

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio = Column(Integer, nullable=False)


class Contacto(Base):
    __tablename__ = "contactos"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    mensaje = Column(Text, nullable=False)
