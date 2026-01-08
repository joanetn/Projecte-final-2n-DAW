from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import PuntuacioCreate, PuntuacioUpdate, PuntuacioResponse
from app.crud import puntuacio_crud

router = APIRouter(tags=["Puntuacions"])

@router.post("/", response_model=PuntuacioResponse)
def create_puntuacio(puntuacio: PuntuacioCreate, db: Session = Depends(get_db)):
    return puntuacio_crud.create(db, puntuacio)

@router.get("/{puntuacio_id}", response_model=PuntuacioResponse)
def get_puntuacio(puntuacio_id: int, db: Session = Depends(get_db)):
    puntuacio = puntuacio_crud.get(db, puntuacio_id)
    if not puntuacio:
        raise HTTPException(status_code=404, detail="Puntuacio not found")
    return puntuacio

@router.put("/{puntuacio_id}", response_model=PuntuacioResponse)
def update_puntuacio(puntuacio_id: int, puntuacio: PuntuacioUpdate, db: Session = Depends(get_db)):
    return puntuacio_crud.update(db, puntuacio_id, puntuacio)

@router.delete("/{puntuacio_id}")
def delete_puntuacio(puntuacio_id: int, db: Session = Depends(get_db)):
    puntuacio_crud.delete(db, puntuacio_id)
    return {"message": "Puntuacio deleted successfully"}