from pydantic import BaseModel, constr, EmailStr
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    name: constr(min_length=1)
    phone: constr(min_length=6)
    email: Optional[EmailStr] = None
    service: constr(min_length=1)
    date: constr(min_length=10)  # YYYY-MM-DD
    time: constr(min_length=4)   # HH:MM
    notes: Optional[str] = None

class BookingRead(BookingCreate):
    id: int
    created_at: datetime
