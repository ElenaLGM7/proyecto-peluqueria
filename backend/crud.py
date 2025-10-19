# backend/app/crud.py
from sqlmodel import Session, select
from .database import engine
from .models import Booking, Contact

def create_booking(payload: Booking) -> Booking:
    with Session(engine) as session:
        session.add(payload)
        session.commit()
        session.refresh(payload)
        return payload

def list_bookings(limit: int = 200):
    with Session(engine) as session:
        stmt = select(Booking).order_by(Booking.date, Booking.time).limit(limit)
        return session.exec(stmt).all()

def create_contact(payload: Contact) -> Contact:
    with Session(engine) as session:
        session.add(payload)
        session.commit()
        session.refresh(payload)
        return payload
