"""
Excepciones del Dominio (Domain Exceptions)
Errores específicos que pueden ocurrir en la lógica de ligas.
"""


class LeagueNotFound(Exception):
    """Se lanza cuando no se encuentra una liga"""
    def __init__(self, league_id: int):
        self.league_id = league_id
        self.message = f"Liga con ID {league_id} no encontrada"
        super().__init__(self.message)


class LeagueAlreadyExists(Exception):
    """Se lanza cuando intentas crear una liga que ya existe"""
    def __init__(self, league_name: str):
        self.league_name = league_name
        self.message = f"La liga '{league_name}' ya existe"
        super().__init__(self.message)
