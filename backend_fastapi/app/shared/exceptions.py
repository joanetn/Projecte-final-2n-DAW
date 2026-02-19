class ResourceNotFound(Exception):
    def __init__(self, resource_name: str, identifier: str):
        self.resource_name = resource_name
        self.identifier = identifier

        self.message = f"{resource_name} con ID {identifier} no encontrado"
        super().__init__(self.message)


class DatabaseError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)
