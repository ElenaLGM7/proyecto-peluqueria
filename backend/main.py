from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend import crud, schemas

app = FastAPI(title="Belleza Studio Demo API")

# Permitir CORS para que el frontend Netlify pueda comunicarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción reemplazar por el dominio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/contact")
async def create_contact(contact: schemas.ContactCreate):
    try:
        new_contact = crud.create_contact(contact)
        return {"message": "Mensaje recibido", "contact": new_contact}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/book")
async def create_booking(booking: schemas.BookingCreate):
    try:
        new_booking = crud.create_booking(booking)
        return {"message": "Reserva recibida", "booking": new_booking}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/bookings")
async def list_bookings():
    return crud.get_all_bookings()
