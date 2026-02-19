from pydantic import BaseModel, field_validator
from typing import Optional, Union
from datetime import datetime
from uuid import UUID


class LeagueDTO(BaseModel):
    id: Union[str, UUID]
    nom: str
    categoria: str
    dataInici: datetime
    dataFi: Optional[datetime] = None
    status: str
    isActive: bool
    logo_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @field_validator('id', mode='before')
    @classmethod
    def convert_id_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v
    
    class Config:
        # Permitir que Pydantic trabaje con objetos que no sean dicts
        # (como objetos SQLAlchemy ORM)
        from_attributes = True
