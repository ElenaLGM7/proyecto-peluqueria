# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from dotenv import load_dotenv
import os

load_dotenv()

from .database import create_db_and_tables, engine
from .models import Booking, Contact
from .schemas import BookingCreate, BookingRead, ContactCreate, ContactRead
from .crud import create_booking, list_bookings, create_contact
from .utils import try_send_email

app = FastAPI(title="Belleza Studio - API")

# CORS: permitir el frontend (env FRONTEND_URL) o "*" para demo
FRONTEND_URL = os.getenv("FRONTEND_URL") or "*"
allow_origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # crear tablas si no existen
    create_db_and_tables()

@app.post("/api/bookings", response_model=BookingRead)
def api_create_booking(payload: BookingCreate):
    # comprobar solapamientos básicos (opcional: mejorar)
    # guardamos en DB
    booking = Booking(**payload.dict())
    saved = create_booking(booking)

    # intentar notificar al propietario (si SMTP configurado)
    owner_email = os.getenv("FROM_EMAIL") or None
    if owner_email:
        subject = f"Nueva reserva: {saved.name}"
        body = f"Reserva: {saved.service} - {saved.date} {saved.time}\nTel: {saved.phone}\nEmail: {saved.email}\nNotas: {saved.notes}"
        try_send_email(subject, body, owner_email)

    return saved

@app.get("/api/bookings", response_model=list[BookingRead])
def api_list_bookings(limit: int = 200):
    return list_bookings(limit=limit)

@app.post("/api/contact", response_model=ContactRead)
def api_create_contact(payload: ContactCreate):
    contact = Contact(**payload.dict())
    saved = create_contact(contact)

    # notificar al propietario si hay email configurado
    owner_email = os.getenv("FROM_EMAIL") or None
    if owner_email:
        subject = f"Nuevo mensaje web de {saved.name}"
        body = f"De: {saved.name} <{saved.email}>\n\n{saved.message}"
        try_send_email(subject, body, owner_email)

    return saved
