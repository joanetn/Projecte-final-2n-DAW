import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL"
    )
    
    APP_ENV: str = os.getenv("APP_ENV", "development")

    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

    CORS_ORIGINS: list = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:8000"
    ).split(",")

    APP_TITLE: str = "API Ligera fastapi"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Backend ligero en FastAPI con Clean Architecture"

settings = Settings()
