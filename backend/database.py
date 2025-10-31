from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Cargar las variables del archivo .env
load_dotenv()

# URL de conexión a la base de datos
# Ejemplo de formato:
# postgresql+psycopg2://usuario:contraseña@host:puerto/nombre_db
DATABASE_URL = os.getenv("DATABASE_URL")

# Crear el motor de SQLAlchemy
engine = create_engine(DATABASE_URL)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Dependencia para obtener la sesión en cada petición FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
