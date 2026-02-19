class LeagueNotFound(Exception):
    def __init__(self, league_id: int):
        self.league_id = league_id
        self.message = f"Liga con ID {league_id} no encontrada"
        super().__init__(self.message)


class LeagueAlreadyExists(Exception):
    def __init__(self, league_name: str):
        self.league_name = league_name
        self.message = f"La liga '{league_name}' ya existe"
        super().__init__(self.message)
