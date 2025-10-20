from sqlmodel import Session, select
from .models import Booking
from .database import engine

def create_booking(session: Session, booking: Booking):
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking

def list_bookings_by_date(session: Session, date: str):
    stmt = select(Booking).where(Booking.date == date).order_by(Booking.time)
    return session.exec(stmt).all()
