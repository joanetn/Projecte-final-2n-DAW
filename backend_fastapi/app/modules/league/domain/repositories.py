"""
Interfaz de Repositorio (Domain Layer)
Define el CONTRATO de qué métodos debe tener un repositorio de ligas.
La implementación real está en infrastructure/repository.py

Esto es un ABC (Abstract Base Class) - es decir, es una interfaz abstracta.
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from .entities import League


class LeagueRepository(ABC):
    """
    Interfaz que define qué operaciones debe poder hacer un repositorio de ligas.
    
    Las clases que implementen esta interfaz pueden acceder a datos de diferentes
    fuentes (BD, API externa, archivo JSON, etc.) pero siempre devuelven League entities.
    """
    
    @abstractmethod
    def get_all(self) -> List[League]:
        """
        Obtiene TODAS las ligas de la fuente de datos.
        
        Returns:
            List[League]: Lista vacía si no hay ligas, lista con ligas si las hay
            
        Raises:
            Exception: Si hay error al acceder a los datos
        """
        pass
    
    @abstractmethod
    def get_by_id(self, league_id: int) -> Optional[League]:
        """
        Obtiene UNA liga por su ID.
        
        Args:
            league_id: ID de la liga a buscar
            
        Returns:
            League si existe, None si no existe
        """
        pass
    
    @abstractmethod
    def get_by_name(self, name: str) -> Optional[League]:
        """
        Obtiene UNA liga por su nombre.
        
        Args:
            name: Nombre de la liga a buscar
            
        Returns:
            League si existe, None si no existe
        """
        pass
