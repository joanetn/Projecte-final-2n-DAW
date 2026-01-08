from sqlalchemy.orm import Session
from app.domain.models import Jornada
from app.schemas import JornadaCreate, JornadaUpdate

def create(db: Session, jornada: JornadaCreate):
    db_jornada = Jornada(**jornada.dict())
    db.add(db_jornada)
    db.commit()
    db.refresh(db_jornada)
    return db_jornada

def get(db: Session, jornada_id: int):
    return db.query(Jornada).filter(Jornada.id == jornada_id).first()

def update(db: Session, jornada_id: int, jornada: JornadaUpdate):
    db_jornada = db.query(Jornada).filter(Jornada.id == jornada_id).first()
    if db_jornada:
        for key, value in jornada.dict(exclude_unset=True).items():
            setattr(db_jornada, key, value)
        db.commit()
        db.refresh(db_jornada)
    return db_jornada

def delete(db: Session, jornada_id: int):
    db_jornada = db.query(Jornada).filter(Jornada.id == jornada_id).first()
    if db_jornada:
        db.delete(db_jornada)
        db.commit()