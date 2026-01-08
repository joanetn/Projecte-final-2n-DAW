from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

@dataclass
class Jornada:
    id: int
    nombre: str
    fecha: datetime
    liga_id: int

@dataclass
class Liga:
    id: int
    nombre: str
    jornadas: Optional[List[int]]

@dataclass
class Partit:
    id: int
    jornada_id: int
    local_id: int
    visitante_id: int
    puntuaciones: Optional[List[int]]

@dataclass
class Puntuacio:
    id: int
    partit_id: int
    jugador_id: int
    punts: int
