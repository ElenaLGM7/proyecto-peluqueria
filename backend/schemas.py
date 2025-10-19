# backend/app/schemas.py
from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    name: constr(min_length=1)
    phone: constr(min_length=6)
    email: Optional[EmailStr] = None
    service: str
    date: str  # formato YYYY-MM-DD
    time: str  # formato HH:MM
    notes: Optional[str] = None

class BookingRead(BookingCreate):
    id: int
    created_at: datetime

class ContactCreate(BaseModel):
    name: constr(min_length=1)
    email: EmailStr
    message: constr(min_length=1)

class ContactRead(ContactCreate):
    id: int
    created_at: datetime
