from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class LeagueSchema(BaseModel):
    id: str = Field(..., description="ID único de la liga (UUID)")
    nom: str = Field(..., description="Nombre de la liga (ej: La Liga)")
    categoria: str = Field(..., description="Categoría (ej: senior, infantil)")
    dataInici: datetime = Field(..., description="Fecha de inicio de la liga")
    dataFi: Optional[datetime] = Field(None, description="Fecha de fin de la liga")
    status: str = Field(..., description="Estado (NOT_STARTED, IN_PROGRESS, FINISHED)")
    isActive: bool = Field(..., description="Si la liga está activa")
    logo_url: Optional[str] = Field(None, description="URL del logo de la liga")
    created_at: Optional[datetime] = Field(None, description="Fecha de creación")
    updated_at: Optional[datetime] = Field(None, description="Fecha de última actualización")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "nom": "La Liga",
                "categoria": "senior",
                "dataInici": "2025-01-01T00:00:00",
                "dataFi": "2025-05-31T23:59:59",
                "status": "IN_PROGRESS",
                "isActive": True,
                "logo_url": "https://image.url/logo.png",
                "created_at": "2025-02-19T10:30:00",
                "updated_at": "2025-02-19T10:30:00"
            }
        }
