from sqlalchemy.orm import Session
from app.domain.models import Puntuacio
from app.schemas import PuntuacioCreate, PuntuacioUpdate

def create(db: Session, puntuacio: PuntuacioCreate):
    db_puntuacio = Puntuacio(**puntuacio.dict())
    db.add(db_puntuacio)
    db.commit()
    db.refresh(db_puntuacio)
    return db_puntuacio

def get(db: Session, puntuacio_id: int):
    return db.query(Puntuacio).filter(Puntuacio.id == puntuacio_id).first()

def update(db: Session, puntuacio_id: int, puntuacio: PuntuacioUpdate):
    db_puntuacio = db.query(Puntuacio).filter(Puntuacio.id == puntuacio_id).first()
    if db_puntuacio:
        for key, value in puntuacio.dict(exclude_unset=True).items():
            setattr(db_puntuacio, key, value)
        db.commit()
        db.refresh(db_puntuacio)
    return db_puntuacio

def delete(db: Session, puntuacio_id: int):
    db_puntuacio = db.query(Puntuacio).filter(Puntuacio.id == puntuacio_id).first()
    if db_puntuacio:
        db.delete(db_puntuacio)
        db.commit()