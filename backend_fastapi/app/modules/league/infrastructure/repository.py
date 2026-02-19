from typing import List, Optional
from sqlalchemy.orm import Session

from ..domain.repositories import LeagueRepository
from ..domain.entities import League
from .models import LeagueModel
from .mappers import LeagueMapper


class LeagueRepositoryImpl(LeagueRepository):    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[League]:
        models = self.db.query(LeagueModel).all()

        entities = [
            LeagueMapper.model_to_entity(model)
            for model in models
        ]

        return entities
    
    def get_by_id(self, league_id: int) -> Optional[League]:
        model = self.db.query(LeagueModel).filter(
            LeagueModel.id == league_id
        ).first()

        if model is None:
            return None

        return LeagueMapper.model_to_entity(model)
    
    def get_by_name(self, name: str) -> Optional[League]:
        model = self.db.query(LeagueModel).filter(
            LeagueModel.name == name
        ).first()
        
        if model is None:
            return None

        return LeagueMapper.model_to_entity(model)
