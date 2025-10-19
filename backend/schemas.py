from pydantic import BaseModel, EmailStr
from datetime import date, time

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    date: date
    time: time
