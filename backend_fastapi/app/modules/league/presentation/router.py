"""
Router de Ligas (Presentation Layer)
Define los ENDPOINTS de la API para ligas.
Es lo que React llama cuando hace fetch() a http://localhost:8000/api/leagues

Estos son los puntos públicos de entrada (HTTP endpoints).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Imports de las otras capas
from ..application.queries import GetAllLeaguesQuery, GetLeagueByIdQuery
from ..domain.exceptions import LeagueNotFound
from ..infrastructure.repository import LeagueRepositoryImpl
from .schemas import LeagueSchema
from app.shared.database import get_db
from app.shared.responses import ApiResponse, ResponseStatus


# Crear un router para las ligas
# APIRouter es como un grupo de rutas en Express o Laravel
router = APIRouter(
    prefix="/leagues",  # Prefijo: todos los endpoints empezarán con /leagues
    tags=["Leagues"]  # Tag para la documentación Swagger
)


@router.get(
    "",
    response_model=ApiResponse,
    status_code=status.HTTP_200_OK,
    summary="Obtener todas las ligas",
    description="Devuelve todas las ligas disponibles para mostrar en el carrusel del home"
)
def get_all_leagues(db: Session = Depends(get_db)):
    """
    Endpoint GET /api/leagues
    
    Obtiene TODAS las ligas para el carrusel del home.
    
    Flujo:
    1. FastAPI inyecta una sesión de BD (db: Session = Depends(get_db))
    2. Creamos el repositorio con esa sesión
    3. Creamos el query (caso de uso) con el repositorio
    4. Ejecutamos el query que devuelve una lista de DTOs
    5. Devolvemos la respuesta envuelta en ApiResponse
    
    Returns:
        ApiResponse con lista de ligas en formato JSON
        
    Ejemplo de respuesta:
        {
            "status": "success",
            "data": [
                {
                    "id": 1,
                    "name": "La Liga",
                    "country": "España",
                    "logo_url": "https://...",
                    "founded_year": 1929
                },
                {
                    "id": 2,
                    "name": "Premier League",
                    "country": "Inglaterra",
                    "logo_url": "https://...",
                    "founded_year": 1992
                }
            ],
            "message": "Ligas obtenidas correctamente"
        }
    """
    try:
        # 1. Crear el repositorio (inyección de dependencias)
        # Le pasamos la sesión de BD
        repository = LeagueRepositoryImpl(db)
        
        # 2. Crear el query (caso de uso)
        # Le pasamos el repositorio
        query = GetAllLeaguesQuery(repository)
        
        # 3. Ejecutar el query
        # Devuelve una lista de LeagueDTO
        leagues_dtos = query.execute()
        
        # 4. Convertir DTOs a Schemas para la API
        # (aunque aquí son muy parecidos, es buena práctica)
        leagues_schemas = [
            LeagueSchema(
                id=dto.id,
                name=dto.name,
                country=dto.country,
                logo_url=dto.logo_url,
                founded_year=dto.founded_year,
                created_at=dto.created_at,
                updated_at=dto.updated_at
            )
            for dto in leagues_dtos
        ]
        
        # 5. Devolver respuesta exitosa
        return ApiResponse(
            status=ResponseStatus.SUCCESS,
            data=leagues_schemas,
            message="Ligas obtenidas correctamente"
        )
    
    except Exception as e:
        # Si hay algún error inesperado, devolverlo
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener ligas: {str(e)}"
        )


@router.get(
    "/{league_id}",
    response_model=ApiResponse,
    status_code=status.HTTP_200_OK,
    summary="Obtener una liga por ID",
    description="Devuelve los detalles de una liga específica"
)
def get_league_by_id(league_id: int, db: Session = Depends(get_db)):
    """
    Endpoint GET /api/leagues/{id}
    
    Obtiene UNA liga específica por su ID.
    
    Args:
        league_id: ID de la liga (ej: 1)
        db: Sesión de BD inyectada automáticamente por FastAPI
    
    Returns:
        ApiResponse con los datos de una liga
        
    Raises:
        HTTPException 404: Si la liga no existe
        HTTPException 500: Si hay error en la BD
        
    Ejemplo:
        GET /api/leagues/1
        Respuesta:
        {
            "status": "success",
            "data": {
                "id": 1,
                "name": "La Liga",
                "country": "España",
                "logo_url": "https://...",
                "founded_year": 1929
            }
        }
    """
    try:
        # 1. Crear el repositorio
        repository = LeagueRepositoryImpl(db)
        
        # 2. Crear el query
        query = GetLeagueByIdQuery(repository)
        
        # 3. Ejecutar el query
        league_dto = query.execute(league_id)
        
        # 4. Convertir a schema
        league_schema = LeagueSchema(
            id=league_dto.id,
            name=league_dto.name,
            country=league_dto.country,
            logo_url=league_dto.logo_url,
            founded_year=league_dto.founded_year,
            created_at=league_dto.created_at,
            updated_at=league_dto.updated_at
        )
        
        # 5. Devolver respuesta
        return ApiResponse(
            status=ResponseStatus.SUCCESS,
            data=league_schema,
            message=f"Liga '{league_schema.name}' obtenida correctamente"
        )
    
    except LeagueNotFound as e:
        # Si la liga no existe, devolver 404
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.message
        )
    except Exception as e:
        # Error inesperado
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener liga: {str(e)}"
        )
