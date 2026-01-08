from pydantic import BaseModel
from typing import List, Optional

class LigaBase(BaseModel):
    nombre: str
    categoria: str

class LigaCreate(LigaBase):
    pass

class LigaUpdate(LigaBase):
    pass

class LigaResponse(LigaBase):
    id: int
    jornadas: Optional[List[int]]
    equipos: Optional[List[int]]

    class Config:
        orm_mode = True