from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).parent

class Settings(BaseSettings):
    PROJECT_NAME: str
    VERSION: str

    class Config:
        env_file = BASE_DIR / ".env"

settings = Settings()