"""
Schemas de Presentación (Presentation Layer)
Define cómo se ven los datos que viajan por la API.
Son los objetos JSON que ve React cuando hace las peticiones.

Estos schemas son DIFERENTES a los DTOs:
- DTOs: transferencia interna entre capas
- Schemas: lo que sale por la API (JSON)
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class LeagueSchema(BaseModel):
    """
    Schema de una Liga para respuestas de API.
    
    Este es el JSON que React recibe.
    
    Ejemplo JSON:
        {
            "id": 1,
            "name": "La Liga",
            "country": "España",
            "logo_url": "https://...",
            "founded_year": 1929
        }
    """
    id: int = Field(..., description="ID único de la liga")
    name: str = Field(..., description="Nombre de la liga (ej: La Liga)")
    country: str = Field(..., description="País de la liga (ej: España)")
    logo_url: Optional[str] = Field(None, description="URL del logo de la liga")
    founded_year: Optional[int] = Field(None, description="Año de fundación de la liga")
    created_at: Optional[datetime] = Field(None, description="Fecha de creación")
    updated_at: Optional[datetime] = Field(None, description="Fecha de última actualización")
    
    class Config:
        # Permitir ORM mode: que Pydantic entienda objetos SQLAlchemy
        from_attributes = True
        # Ejemplo de respuesta en la documentación Swagger
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "La Liga",
                "country": "España",
                "logo_url": "https://image.url/logo.png",
                "founded_year": 1929,
                "created_at": "2025-02-19T10:30:00",
                "updated_at": "2025-02-19T10:30:00"
            }
        }
