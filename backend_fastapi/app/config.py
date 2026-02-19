"""
Archivo de Configuración
Define las configuraciones de la app (BD, CORS, variables de entorno, etc.)
"""

import os
from dotenv import load_dotenv

# Cargar variables de entorno del archivo .env
# Esto permite tener secretos sin guardarlos en el código
load_dotenv()


class Settings:
    """
    Clase que centraliza TODAS las configuraciones de la app.
    En lugar de Variables.dispersas por el código, las tenemos aquí.
    """
    
    # Base de datos
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/tu_base_de_datos"
    )
    
    # Entorno (development, production, testing)
    APP_ENV: str = os.getenv("APP_ENV", "development")
    
    # Debug (mostrar queries SQL en consola)
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS - Orígenes permitidos (para que React pueda hacer peticiones)
    # Ejemplo: "http://localhost:5173,http://localhost:3000,https://miapp.com"
    CORS_ORIGINS: list = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000"
    ).split(",")
    
    # Nombre de la app (para la documentación)
    APP_TITLE: str = "API Ligera de Ligas"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Backend ligero en FastAPI con Clean Architecture"


# Instancia global de settings
settings = Settings()
