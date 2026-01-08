from pydantic import BaseModel
from typing import List, Optional

class PartitBase(BaseModel):
    jornada_id: int
    local_id: int
    visitante_id: int

class PartitCreate(PartitBase):
    pass

class PartitUpdate(PartitBase):
    pass

class PartitResponse(PartitBase):
    id: int
    puntuaciones: Optional[List[int]]

    class Config:
        orm_mode = True