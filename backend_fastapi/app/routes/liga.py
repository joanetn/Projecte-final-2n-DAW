from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import LigaCreate, LigaUpdate, LigaResponse
from app.crud import liga_crud

router = APIRouter(tags=["Ligas"])

@router.post("/", response_model=LigaResponse)
def create_liga(liga: LigaCreate, db: Session = Depends(get_db)):
    return liga_crud.create(db, liga)

@router.get("/{liga_id}", response_model=LigaResponse)
def get_liga(liga_id: int, db: Session = Depends(get_db)):
    liga = liga_crud.get(db, liga_id)
    if not liga:
        raise HTTPException(status_code=404, detail="Liga not found")
    return liga

@router.put("/{liga_id}", response_model=LigaResponse)
def update_liga(liga_id: int, liga: LigaUpdate, db: Session = Depends(get_db)):
    return liga_crud.update(db, liga_id, liga)

@router.delete("/{liga_id}")
def delete_liga(liga_id: int, db: Session = Depends(get_db)):
    liga_crud.delete(db, liga_id)
    return {"message": "Liga deleted successfully"}