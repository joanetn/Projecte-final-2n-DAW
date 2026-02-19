from ..domain.entities import League
from .models import LeagueModel


class LeagueMapper:
    @staticmethod
    def model_to_entity(model: LeagueModel) -> League:
        return League(
            id=model.id,
            nom=model.nom,
            categoria=model.categoria,
            dataInici=model.dataInici,
            dataFi=model.dataFi,
            status=model.status,
            isActive=bool(model.isActive),  
            logo_url=model.logo_url,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
    
    @staticmethod
    def entity_to_model(entity: League) -> LeagueModel:
        return LeagueModel(
            id=entity.id,
            nom=entity.nom,
            categoria=entity.categoria,
            dataInici=entity.dataInici,
            dataFi=entity.dataFi,
            status=entity.status,
            isActive=int(entity.isActive),
            logo_url=entity.logo_url,
            created_at=entity.created_at,
            updated_at=entity.updated_at
        )
