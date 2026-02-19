"""
Mappers (Infrastructure Layer)
Convierten datos entre diferentes capas:
- de LeagueModel (BD) a League (entidad de dominio)
- y viceversa si es necesario
"""

from ..domain.entities import League
from .models import LeagueModel


class LeagueMapper:
    """
    Mapper de League.
    Convierte entre LeagueModel (BD) y League (dominio).
    """
    
    @staticmethod
    def model_to_entity(model: LeagueModel) -> League:
        """
        Convierte un LeagueModel (objeto SQLAlchemy de BD) a una League (entidad de dominio).
        
        Args:
            model: Objeto LeagueModel procedente de SQLAlchemy
            
        Returns:
            League: Entidad de dominio limpia
        """
        return League(
            id=model.id,
            nom=model.nom,
            categoria=model.categoria,
            dataInici=model.dataInici,
            dataFi=model.dataFi,
            status=model.status,
            isActive=bool(model.isActive),  # Convertir de int a bool
            logo_url=model.logo_url,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
    
    @staticmethod
    def entity_to_model(entity: League) -> LeagueModel:
        """
        Convierte una League (entidad de dominio) a un LeagueModel (para BD).
        
        Args:
            entity: Entidad de dominio League
            
        Returns:
            LeagueModel: Objeto listo para guardar en BD
        """
        return LeagueModel(
            id=entity.id,
            nom=entity.nom,
            categoria=entity.categoria,
            dataInici=entity.dataInici,
            dataFi=entity.dataFi,
            status=entity.status,
            isActive=int(entity.isActive),  # Convertir bool a int para SQL
            logo_url=entity.logo_url,
            created_at=entity.created_at,
            updated_at=entity.updated_at
        )
