from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class League:
    id: int
    name: str
    category: str
    logo_url: Optional[str] = None
    founded_year: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def __str__(self) -> str:
        return f"Liga: {self.name} ({self.category})"
