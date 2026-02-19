"""
MAIN.PY - Punto de Entrada de la Aplicación FastAPI

Este es el archivo más importante. Aquí:
1. Se crea la aplicación FastAPI
2. Se configuran CORS, middleware, etc.
3. Se registran los routers (endpoints) de cada módulo
4. Se ejecuta el servidor

Flujo cuando React hace GET /api/leagues:
1. FastAPI recibe la petición en el router registrado
2. El router ejecuta la función del endpoint
3. La función devuelve una respuesta JSON
4. FastAPI la envía a React
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

# Imports de configuración
from app.config import settings
from app.shared.responses import ApiResponse, ResponseStatus

# Imports de base de datos (para crear tablas automáticamente)
from app.shared.database import engine
from app.shared.base_model import Base

# Imports de routers de módulos
from app.modules.league.presentation.router import router as league_router

# Importar los modelos para que SQLAlchemy los registre antes de crear tablas
from app.modules.league.infrastructure.models import LeagueModel  # noqa: F401

# ============================================================================
# CREAR LAS TABLAS EN LA BASE DE DATOS (si no existen)
# ============================================================================
# Esto crea la tabla "leagues" automáticamente en PostgreSQL si no existe
Base.metadata.create_all(bind=engine)

# ============================================================================
# CREAR LA APLICACIÓN FASTAPI
# ============================================================================

app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    docs_url="/docs",  # Swagger UI en /docs
    redoc_url="/redoc"  # ReDoc en /redoc
)

# ============================================================================
# CONFIGURAR MIDDLEWARE DE CORS
# ============================================================================

# CORS (Cross-Origin Resource Sharing) permite que React (en otro puerto) 
# haga peticiones a esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Orígenes permitidos (http://localhost:5173, etc.)
    allow_credentials=True,  # Permitir cookies/autenticación
    allow_methods=["GET"],  # Solo GET porque es un servidor de lectura
    allow_headers=["*"],  # Permitir cualquier header
)

# ============================================================================
# MANEJADOR GLOBAL DE EXCEPCIONES
# ============================================================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    """
    Manejador personalizado para errores de validación.
    Cuando Pydantic valida un request y falla, lo capturamos aquí.
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "validation_error",
            "message": "Error en la validación del request",
            "errors": str(exc)
        }
    )

# ============================================================================
# ENDPOINTS BÁSICOS
# ============================================================================

@app.get("/health", tags=["Health"])
def health_check():
    """
    Health Check: endpoint para verificar que el servidor está activo.
    
    Devuelve:
        {"status": "ok"}
    
    Se usa para:
    - Monitoreo (¿el servidor está vivo?)
    - Deploy (¿la aplicación se inició correctamente?)
    """
    return {"status": "ok", "environment": settings.APP_ENV}


@app.get("/", tags=["Root"])
def root():
    """
    Endpoint raíz.
    Devuelve información sobre la API.
    """
    return ApiResponse(
        status=ResponseStatus.SUCCESS,
        message="Bienvenido a la API de Ligas",
        data={
            "app": settings.APP_TITLE,
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "endpoints": {
                "leagues": "/api/leagues",
                "health": "/health"
            }
        }
    )

# ============================================================================
# REGISTRAR ROUTERS DE MÓDULOS
# ============================================================================

# Incluir el router de ligas
# prefix="/api" = todos los endpoints de ligas empezarán con /api/leagues
app.include_router(league_router, prefix="/api")

# Cuando añadas nuevos módulos, aquí es donde los registras:
# app.include_router(club_router, prefix="/api")
# app.include_router(user_router, prefix="/api")
# etc.

# ============================================================================
# PUNTO DE ENTRADA
# ============================================================================

if __name__ == "__main__":
    """
    Si ejecutas este archivo directamente (python app/main.py),
    se lanza el servidor.
    
    Para desarrollo:
        uvicorn app.main:app --reload --port 8001
    
    Para producción:
        uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4
    """
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=settings.DEBUG,
        log_level="info"
    )
