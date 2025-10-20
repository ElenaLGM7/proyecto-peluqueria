from sqlmodel import SQLModel, create_engine
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL no encontrada en .env")

# create_engine manejará la conexión a Postgres (Neon)
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
