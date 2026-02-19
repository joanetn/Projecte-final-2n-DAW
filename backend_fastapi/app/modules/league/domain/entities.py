from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class League:
    id: int
    nom: str
    categoria: str
    dataInici: datetime
    logo_url: Optional[str] = None
    dataFi: Optional[datetime] = None
    status: str = 'NOT_STARTED'
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    isActive: bool = True
    
    def __str__(self) -> str:
        return f"Liga: {self.name} ({self.categoria})"
