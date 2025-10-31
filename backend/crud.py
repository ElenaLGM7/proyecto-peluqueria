from sqlalchemy.orm import Session
import models, schemas

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
    return db_cita
