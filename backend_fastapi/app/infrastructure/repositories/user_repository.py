from typing import List
from app.domain.models import User

class UserRepository:
    def __init__(self):
        self._users = []
        self._id_counter = 1

    def create(self, username: str, email: str) -> User:
        user = User(id=self._id_counter, username=username, email=email)
        self._users.append(user)
        self._id_counter += 1
        return user

    def list_all(self) -> List[User]:
        return self._users
