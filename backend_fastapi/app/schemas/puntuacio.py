from pydantic import BaseModel

class PuntuacioBase(BaseModel):
    partit_id: int
    jugador_id: int
    punts: int

class PuntuacioCreate(PuntuacioBase):
    pass

class PuntuacioUpdate(PuntuacioBase):
    pass

class PuntuacioResponse(PuntuacioBase):
    id: int

    class Config:
        orm_mode = True