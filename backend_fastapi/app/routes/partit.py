from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import PartitCreate, PartitUpdate, PartitResponse
from app.crud import partit_crud

router = APIRouter(tags=["Partits"])

@router.post("/", response_model=PartitResponse)
def create_partit(partit: PartitCreate, db: Session = Depends(get_db)):
    return partit_crud.create(db, partit)

@router.get("/{partit_id}", response_model=PartitResponse)
def get_partit(partit_id: int, db: Session = Depends(get_db)):
    partit = partit_crud.get(db, partit_id)
    if not partit:
        raise HTTPException(status_code=404, detail="Partit not found")
    return partit

@router.put("/{partit_id}", response_model=PartitResponse)
def update_partit(partit_id: int, partit: PartitUpdate, db: Session = Depends(get_db)):
    return partit_crud.update(db, partit_id, partit)

@router.delete("/{partit_id}")
def delete_partit(partit_id: int, db: Session = Depends(get_db)):
    partit_crud.delete(db, partit_id)
    return {"message": "Partit deleted successfully"}