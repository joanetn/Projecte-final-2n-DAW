from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JornadaBase(BaseModel):
    nombre: str
    fecha: datetime

class JornadaCreate(JornadaBase):
    liga_id: int

class JornadaUpdate(JornadaBase):
    pass

class JornadaResponse(JornadaBase):
    id: int
    liga_id: int
    partits: Optional[List[int]]

    class Config:
        orm_mode = True