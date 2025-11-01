# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from .utils import try_send_email

# -------- SERVICIOS --------
def get_servicios(db: Session):
    return db.query(models.Servicio).all()

def create_servicio(db: Session, servicio: schemas.ServicioCreate):
    db_servicio = models.Servicio(**servicio.dict())
    db.add(db_servicio)
    db.commit()
    db.refresh(db_servicio)
    return db_servicio

# -------- CITAS --------
def get_citas(db: Session):
    return db.query(models.Cita).all()

def create_cita(db: Session, cita: schemas.CitaCreate):
    db_cita = models.Cita(**cita.dict())
    db.add(db_cita)
    db.commit()
    db.refresh(db_cita)

    # Enviar correo de notificación
    asunto = f"💇 Nueva cita de {db_cita.nombre}"
    cuerpo = (
        f"📅 Fecha: {db_cita.fecha}\n"
        f"🕒 Hora: {db_cita.hora}\n"
        f"💇 Servicios: {db_cita.servicio}\n\n"
        f"👤 Cliente: {db_cita.nombre}\n"
        f"📧 Correo: {db_cita.correo}\n"
        f"📞 Teléfono: {db_cita.telefono}"
    )

    try_send_email(asunto, cuerpo, "elenaguardia.dev@gmail.com")

    return db_cita
