"""
Inyección de Dependencias
Aquí definimos las dependencias globales que FastAPI puede inyectar en los endpoints.
Por ahora solo tenemos get_db, pero si crecemos podemos añadir más aquí.
"""

from app.shared.database import get_db

# Exportar para que sea fácil importar en otros lugares
__all__ = ["get_db"]
