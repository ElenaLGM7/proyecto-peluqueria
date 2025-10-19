# backend/app/database.py
from sqlmodel import SQLModel, create_engine
import os
from dotenv import load_dotenv

load_dotenv()  # carga DATABASE_URL desde .env

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL no está definido en .env")

# create_engine de SQLModel (SQLAlchemy)
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
