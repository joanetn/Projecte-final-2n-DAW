from fastapi import APIRouter
from app.schemas.user import UserCreate, UserResponse
from app.infrastructure.repositories.user_repository import UserRepository

api_router = APIRouter(prefix="/api/v1")

# Repositorio
user_repo = UserRepository()

@api_router.get("/health")
def health_check():
    return {"status": "healthy"}

# Crear usuario
@api_router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate):
    new_user = user_repo.create(username=user.username, email=user.email)
    return new_user

# Listar usuarios
@api_router.get("/users", response_model=list[UserResponse])
def list_users():
    return user_repo.list_all()
