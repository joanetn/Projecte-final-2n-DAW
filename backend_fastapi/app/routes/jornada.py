from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import JornadaCreate, JornadaUpdate, JornadaResponse
from app.crud import jornada_crud

router = APIRouter(tags=["Jornadas"])

@router.post("/", response_model=JornadaResponse)
def create_jornada(jornada: JornadaCreate, db: Session = Depends(get_db)):
    return jornada_crud.create(db, jornada)

@router.get("/{jornada_id}", response_model=JornadaResponse)
def get_jornada(jornada_id: int, db: Session = Depends(get_db)):
    jornada = jornada_crud.get(db, jornada_id)
    if not jornada:
        raise HTTPException(status_code=404, detail="Jornada not found")
    return jornada

@router.put("/{jornada_id}", response_model=JornadaResponse)
def update_jornada(jornada_id: int, jornada: JornadaUpdate, db: Session = Depends(get_db)):
    return jornada_crud.update(db, jornada_id, jornada)

@router.delete("/{jornada_id}")
def delete_jornada(jornada_id: int, db: Session = Depends(get_db)):
    jornada_crud.delete(db, jornada_id)
    return {"message": "Jornada deleted successfully"}