"""
Schemas de Respuesta Genéricos
Define las estructuras de respuesta que usa toda la API.
"""

from pydantic import BaseModel
from typing import Optional, List, Any
from enum import Enum


class ResponseStatus(str, Enum):
    """Estados posibles de una respuesta API"""
    SUCCESS = "success"
    ERROR = "error"
    VALIDATION_ERROR = "validation_error"


class ApiResponse(BaseModel):
    """
    Estructura genérica de respuesta API.
    Todas nuestras respuestas seguirán este formato.
    
    Ejemplo:
        {
            "status": "success",
            "data": [...],
            "message": "Ligas obtenidas correctamente",
            "timestamp": "2025-02-19T10:30:00"
        }
    """
    status: ResponseStatus
    data: Optional[Any] = None  # Los datos (ligas, usuarios, etc.)
    message: Optional[str] = None  # Mensaje descriptivo
    errors: Optional[List[str]] = None  # Lista de errores si hubo
    
    class Config:
        # Permitir que Pydantic serialize los Enums como strings
        use_enum_values = True
