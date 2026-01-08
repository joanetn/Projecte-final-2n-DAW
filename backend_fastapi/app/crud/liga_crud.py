from sqlalchemy.orm import Session
from app.domain.models import Liga
from app.schemas import LigaCreate, LigaUpdate

def create(db: Session, liga: LigaCreate):
    db_liga = Liga(**liga.dict())
    db.add(db_liga)
    db.commit()
    db.refresh(db_liga)
    return db_liga

def get(db: Session, liga_id: int):
    return db.query(Liga).filter(Liga.id == liga_id).first()

def update(db: Session, liga_id: int, liga: LigaUpdate):
    db_liga = db.query(Liga).filter(Liga.id == liga_id).first()
    if db_liga:
        for key, value in liga.dict(exclude_unset=True).items():
            setattr(db_liga, key, value)
        db.commit()
        db.refresh(db_liga)
    return db_liga

def delete(db: Session, liga_id: int):
    db_liga = db.query(Liga).filter(Liga.id == liga_id).first()
    if db_liga:
        db.delete(db_liga)
        db.commit()