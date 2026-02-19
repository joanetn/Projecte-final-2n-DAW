"""
Database Configuration
Configurar la conexión a la base de datos PostgreSQL usando SQLAlchemy.
Usa la misma base de datos que Laravel (projecte_final).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os

# Cargar variables de entorno del .env
load_dotenv()

# Obtener la URL de la base de datos desde variables de entorno
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_db
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:1234@localhost:5432/projecte_final"
)

# Crear el motor de la base de datos
# - echo=False: no imprime las queries SQL (cambiar a True para debug)
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Cambiar a True si quieres ver las queries SQL en consola
)

# SessionLocal es la factory para crear nuevas sesiones con la DB
# Cada sesión es una conexión a la base de datos
SessionLocal = sessionmaker(
    autocommit=False,  # No hacer commit automático
    autoflush=False,   # No hacer flush automático
    bind=engine        # Usar el engine creado arriba
)


def get_db() -> Session:
    """
    Función para obtener una sesión de base de datos.
    Se usa como dependencia en FastAPI (dependency injection).
    
    Yields:
        Session: Una sesión de SQLAlchemy para interactuar con la DB
    
    Ejemplo de uso en FastAPI:
        @app.get("/leagues")
        def get_leagues(db: Session = Depends(get_db)):
            # db ya es una sesión lista para usar
            pass
    """
    # Crear una nueva sesión
    db = SessionLocal()
    try:
        # Entregar la sesión al endpoint
        yield db
    finally:
        # Cerrar la sesión cuando termina (importante para liberar recursos)
        db.close()
