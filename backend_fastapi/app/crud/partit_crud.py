from sqlalchemy.orm import Session
from app.domain.models import Partit
from app.schemas import PartitCreate, PartitUpdate

def create(db: Session, partit: PartitCreate):
    db_partit = Partit(**partit.dict())
    db.add(db_partit)
    db.commit()
    db.refresh(db_partit)
    return db_partit

def get(db: Session, partit_id: int):
    return db.query(Partit).filter(Partit.id == partit_id).first()

def update(db: Session, partit_id: int, partit: PartitUpdate):
    db_partit = db.query(Partit).filter(Partit.id == partit_id).first()
    if db_partit:
        for key, value in partit.dict(exclude_unset=True).items():
            setattr(db_partit, key, value)
        db.commit()
        db.refresh(db_partit)
    return db_partit

def delete(db: Session, partit_id: int):
    db_partit = db.query(Partit).filter(Partit.id == partit_id).first()
    if db_partit:
        db.delete(db_partit)
        db.commit()