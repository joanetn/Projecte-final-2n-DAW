"""
Queries (Application Use Cases)
Una Query es un caso de uso de LECTURA (no modifica datos).
Contienen la lógica de aplicación: "¿Qué debo hacer cuando alguien pide las ligas?"

En Clean Architecture, los Queries son los interlocutores:
- Reciben una solicitud
- Usan el repositorio para obtener datos
- Transforman los datos si es necesario
- Devuelven un resultado
"""

from typing import List
from ..domain.repositories import LeagueRepository
from ..domain.entities import League
from ..domain.exceptions import LeagueNotFound
from .dtos import LeagueDTO


class GetAllLeaguesQuery:
    """
    Query: Obtener TODAS las ligas.
    
    Caso de uso: Cuando React hace GET /api/leagues
    
    Usamos el repositorio para obtener las ligas de la BD y las devolvemos.
    """
    
    def __init__(self, repository: LeagueRepository):
        """
        Constructor: recibe las dependencias que necesita.
        
        Args:
            repository: El repositorio de ligas (inyección de dependencias)
        """
        self.repository = repository
    
    def execute(self) -> List[LeagueDTO]:
        """
        Ejecuta el caso de uso.
        
        Returns:
            List[LeagueDTO]: Lista de DTOs de ligas
            
        Raises:
            Exception: Si hay error al obtener las ligas
        """
        # 1. Obtener todas las ligas del repositorio
        # El repositorio devuelve entidades (League), no datos de BD
        leagues: List[League] = self.repository.get_all()
        
        # 2. Convertir las entidades a DTOs
        # (Aunque aquí son casi iguales, esto es buena práctica)
        leagues_dtos = [
            LeagueDTO(
                id=league.id,
                name=league.name,
                country=league.country,
                logo_url=league.logo_url,
                founded_year=league.founded_year,
                created_at=league.created_at,
                updated_at=league.updated_at
            )
            for league in leagues
        ]
        
        # 3. Devolver la lista
        return leagues_dtos


class GetLeagueByIdQuery:
    """
    Query: Obtener UNA liga por su ID.
    
    Caso de uso: Cuando React hace GET /api/leagues/1
    """
    
    def __init__(self, repository: LeagueRepository):
        """
        Constructor: recibe las dependencias.
        
        Args:
            repository: El repositorio de ligas
        """
        self.repository = repository
    
    def execute(self, league_id: int) -> LeagueDTO:
        """
        Ejecuta el caso de uso.
        
        Args:
            league_id: ID de la liga a obtener
            
        Returns:
            LeagueDTO: La liga solicitada
            
        Raises:
            LeagueNotFound: Si la liga no existe
        """
        # 1. Obtener la liga del repositorio
        league: League = self.repository.get_by_id(league_id)
        
        # 2. Si no existe, lanzar excepción
        if league is None:
            raise LeagueNotFound(league_id)
        
        # 3. Convertir a DTO y devolver
        league_dto = LeagueDTO(
            id=league.id,
            name=league.name,
            country=league.country,
            logo_url=league.logo_url,
            founded_year=league.founded_year,
            created_at=league.created_at,
            updated_at=league.updated_at
        )
        
        return league_dto
