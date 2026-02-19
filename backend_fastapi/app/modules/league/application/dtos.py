"""
Data Transfer Objects (DTOs)
Los DTOs son objetos que transportan datos entre capas.
Se usan para transferir datos desde la capa de infraestructura 
(base de datos) hacia la capa de aplicación de forma limpia.

En este caso, como es un servidor de lectura ligero, no usaremos muchos DTOs,
pero los ponemos aquí por buenas prácticas.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LeagueDTO(BaseModel):
    """
    DTO de una Liga - para transferir datos de una liga.
    Sincronizado con los campos de Laravel.
    
    Este DTO se usa internamente para pasar datos entre capas.
    Lo que el cliente (React) ve es un Schema diferente (ver presentation/schemas.py)
    """
    id: str  # UUID
    nom: str
    categoria: str
    dataInici: datetime
    dataFi: Optional[datetime] = None
    status: str
    isActive: bool
    logo_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        # Permitir que Pydantic trabaje con objetos que no sean dicts
        # (como objetos SQLAlchemy ORM)
        from_attributes = True
