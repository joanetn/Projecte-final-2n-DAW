from fastapi import APIRouter
from app.crud.usuaris import getUsuaris

router = APIRouter()

@router.get('/')
async def getUsuaris():
    try:
        usuaris = await getUsuaris()
        return usuaris
    except Exception as e:
        return {"error": str(e)}