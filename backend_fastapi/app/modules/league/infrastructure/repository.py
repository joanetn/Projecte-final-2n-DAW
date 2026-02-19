"""
Implementación del Repositorio (Infrastructure Layer)
Esta es la implementación REAL del repositorio que accede a la base de datos.

La interfaz está en domain/repositories.py
Aquí implementamos esa interfaz usando SQLAlchemy.
"""

from typing import List, Optional
from sqlalchemy.orm import Session

from ..domain.repositories import LeagueRepository
from ..domain.entities import League
from .models import LeagueModel
from .mappers import LeagueMapper


class LeagueRepositoryImpl(LeagueRepository):
    """
    Implementación del repositorio de ligas usando SQLAlchemy.
    
    Esta clase:
    1. Hereda de LeagueRepository (la interfaz de dominio)
    2. Recibe una sesión de BD en el constructor
    3. Implementa los métodos abstractos con consultas a BD
    4. Convierte resultados de BD (LeagueModel) a entidades de dominio (League)
    """
    
    def __init__(self, db: Session):
        """
        Constructor.
        
        Args:
            db: Sesión de SQLAlchemy conectada a la base de datos
               (esta sesión viene inyectada desde FastAPI)
        """
        self.db = db
    
    def get_all(self) -> List[League]:
        """
        Obtiene TODAS las ligas de la BD.
        
        Query SQL que ejecuta:
            SELECT * FROM leagues;
        
        Returns:
            List[League]: Lista de entidades League
        """
        # 1. Hacer la consulta a la BD
        # db.query(LeagueModel) = SELECT * FROM leagues
        models = self.db.query(LeagueModel).all()
        
        # 2. Convertir cada modelo de BD a entidad de dominio
        # Usamos el mapper para limpiar la conversión
        entities = [
            LeagueMapper.model_to_entity(model)
            for model in models
        ]
        
        # 3. Devolver la lista de entidades
        return entities
    
    def get_by_id(self, league_id: int) -> Optional[League]:
        """
        Obtiene UNA liga por su ID.
        
        Query SQL:
            SELECT * FROM leagues WHERE id = ?;
        
        Args:
            league_id: ID de la liga a buscar
            
        Returns:
            League si existe, None si no existe
        """
        # 1. Hacer la consulta
        # .filter() = WHERE clause
        # .first() = solo traer el primer resultado
        model = self.db.query(LeagueModel).filter(
            LeagueModel.id == league_id
        ).first()
        
        # 2. Si no existe, devolver None
        if model is None:
            return None
        
        # 3. Si existe, convertir a entidad y devolver
        return LeagueMapper.model_to_entity(model)
    
    def get_by_name(self, name: str) -> Optional[League]:
        """
        Obtiene UNA liga por su nombre.
        
        Query SQL:
            SELECT * FROM leagues WHERE name = ?;
        
        Args:
            name: Nombre de la liga a buscar
            
        Returns:
            League si existe, None si no existe
        """
        # 1. Hacer la consulta
        model = self.db.query(LeagueModel).filter(
            LeagueModel.name == name
        ).first()
        
        # 2. Si no existe, devolver None
        if model is None:
            return None
        
        # 3. Si existe, convertir a entidad y devolver
        return LeagueMapper.model_to_entity(model)
