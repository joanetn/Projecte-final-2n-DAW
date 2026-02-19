"""
Excepciones Globales
Errores que pueden ocurrir en cualquier parte de la aplicación.
"""


class ResourceNotFound(Exception):
    """
    Se lanza cuando no se encuentra un recurso en la base de datos.
    Por ejemplo: una liga que no existe.
    """
    def __init__(self, resource_name: str, identifier: str):
        self.resource_name = resource_name
        self.identifier = identifier
        # Mensaje de error amigable
        self.message = f"{resource_name} con ID {identifier} no encontrado"
        super().__init__(self.message)


class DatabaseError(Exception):
    """
    Se lanza cuando ocurre un error al conectar o usar la base de datos.
    """
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)
