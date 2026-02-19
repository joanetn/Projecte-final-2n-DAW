from abc import ABC, abstractmethod
from typing import List, Optional
from .entities import League


class LeagueRepository(ABC):
    
    @abstractmethod
    def get_all(self) -> List[League]:
        pass
    
    @abstractmethod
    def get_by_id(self, league_id: int) -> Optional[League]:
        pass
    
    @abstractmethod
    def get_by_name(self, name: str) -> Optional[League]:
        pass
