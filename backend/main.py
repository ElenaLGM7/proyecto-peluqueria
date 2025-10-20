from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

from .database import create_db_and_tables, engine
from .models import Booking
from .schemas import BookingCreate, BookingRead
from .crud import create_booking, list_bookings_by_date

app = FastAPI(title="Brillo y Estilo API")

FRONTEND_URL = os.getenv("FRONTEND_URL") or "*"
allow_origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mismos servicios/duración que en frontend
SERVICES = {
    "corte": 30,
    "tinte": 60,
    "mechas": 90,
    "peinado": 45
}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def minutes_from_hhmm(hhmm: str):
    h, m = map(int, hhmm.split(":"))
    return h*60 + m

def overlaps(start_a: int, dur_a: int, start_b: int, dur_b: int):
    end_a = start_a + dur_a
    end_b = start_b + dur_b
    return (start_a < end_b) and (start_b < end_a)

@app.post("/api/bookings", response_model=BookingRead, status_code=201)
def api_create_booking(payload: BookingCreate):
    # basic validation of service
    if payload.service not in SERVICES:
        raise HTTPException(status_code=400, detail="Servicio no válido")

    # check date format
    try:
        datetime.strptime(payload.date, "%Y-%m-%d")
        datetime.strptime(payload.time, "%H:%M")
    except Exception:
        raise HTTPException(status_code=400, detail="Formato de fecha/hora incorrecto")

    with Session(engine) as session:
        # fetch existing bookings for that date
        existing = list_bookings_by_date(session, payload.date)
        start_new = minutes_from_hhmm(payload.time)
        dur_new = SERVICES[payload.service]

        # check overlaps
        for b in existing:
            start_b = minutes_from_hhmm(b.time)
            dur_b = SERVICES.get(b.service, 60)
            if overlaps(start_new, dur_new, start_b, dur_b):
                # conflict
                raise HTTPException(status_code=409, detail="Horario ya ocupado")

        # create booking
        booking = Booking(**payload.dict())
        saved = create_booking(session, booking)
        return saved

@app.get("/api/bookings")
def api_get_bookings(date: str):
    # expects query param date=YYYY-MM-DD
    with Session(engine) as session:
        return list_bookings_by_date(session, date)
