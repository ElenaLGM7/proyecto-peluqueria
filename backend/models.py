from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    phone: str
    email: Optional[str] = None
    service: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
