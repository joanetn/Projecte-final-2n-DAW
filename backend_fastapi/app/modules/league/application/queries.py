from typing import List
from ..domain.repositories import LeagueRepository
from ..domain.entities import League
from ..domain.exceptions import LeagueNotFound
from .dtos import LeagueDTO


class GetAllLeaguesQuery:
    
    def __init__(self, repository: LeagueRepository):
        self.repository = repository
    
    def execute(self) -> List[LeagueDTO]:
        leagues: List[League] = [league for league in self.repository.get_all() if league.isActive]

        leagues_dtos = [
            LeagueDTO(
                id=league.id,
                nom=league.nom,
                categoria=league.categoria,
                logo_url=league.logo_url,
                dataInici=league.dataInici,
                dataFi=league.dataFi,
                status=league.status,
                created_at=league.created_at,
                updated_at=league.updated_at,
                isActive=league.isActive
            )
            for league in leagues
        ]

        return leagues_dtos


class GetLeagueByIdQuery:    
    def __init__(self, repository: LeagueRepository):
        self.repository = repository
    
    def execute(self, league_id: int) -> LeagueDTO:
        league: League = self.repository.get_by_id(league_id)

        if league is None:
            raise LeagueNotFound(league_id)

        league_dto = LeagueDTO(
            id=league.id,
            nom=league.nom,
            categoria=league.categoria,
            logo_url=league.logo_url,
            dataInici=league.dataInici,
            dataFi=league.dataFi,
            status=league.status
        )
        
        return league_dto
