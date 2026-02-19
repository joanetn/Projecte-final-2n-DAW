"""
Entidad League (Domain Model)
Esta es la clase pura que representa una Liga en el dominio del negocio.
NO tiene nada que ver con la base de datos aquí, solo datos putos.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class League:
    """
    Entidad League: representa una liga en nuestro dominio.
    
    En Clean Architecture, las entidades son PURAS (no dependen de nada).
    No tienen métodos complejos, solo guardan datos.
    
    Attributes:
        id: Identificador único de la liga
        name: Nombre de la liga (ej: "La Liga")
        country: País de la liga (ej: "España")
        logo_url: URL del logo de la liga (para mostrar en el carrusel)
        founded_year: Año de fundación (opcional)
        created_at: Fecha de creación en la BD
        updated_at: Fecha de última actualización
    """
    id: int
    name: str
    country: str
    logo_url: Optional[str] = None
    founded_year: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def __str__(self) -> str:
        """Representación legible de la liga"""
        return f"Liga: {self.name} ({self.country})"
