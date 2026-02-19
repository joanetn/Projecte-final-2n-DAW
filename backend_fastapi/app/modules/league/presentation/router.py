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
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "nom": "La Liga",
                    "categoria": "senior",
                    "dataInici": "2025-01-01T00:00:00",
                    "dataFi": "2025-05-31T23:59:59",
                    "status": "IN_PROGRESS",
                    "isActive": true,
                    "logo_url": "https://...",
                    "created_at": "2025-01-01T00:00:00",
                    "updated_at": "2025-01-01T00:00:00"
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
                nom=dto.nom,
                categoria=dto.categoria,
                dataInici=dto.dataInici,
                dataFi=dto.dataFi,
                status=dto.status,
                isActive=dto.isActive,
                logo_url=dto.logo_url,
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
def get_league_by_id(league_id: str, db: Session = Depends(get_db)):
    """
    Endpoint GET /api/leagues/{id}
    
    Obtiene UNA liga específica por su ID.
    
    Args:
        league_id: ID UUID de la liga (ej: 550e8400-e29b-41d4-a716-446655440000)
        db: Sesión de BD inyectada automáticamente por FastAPI
    
    Returns:
        ApiResponse con los datos de una liga
        
    Raises:
        HTTPException 404: Si la liga no existe
        HTTPException 500: Si hay error en la BD
        
    Ejemplo:
        GET /api/leagues/550e8400-e29b-41d4-a716-446655440000
        Respuesta:
        {
            "status": "success",
            "data": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "nom": "La Liga",
                "categoria": "senior",
                "dataInici": "2025-01-01T00:00:00",
                "dataFi": "2025-05-31T23:59:59",
                "status": "IN_PROGRESS",
                "isActive": true,
                "logo_url": "https://...",
                "created_at": "2025-01-01T00:00:00",
                "updated_at": "2025-01-01T00:00:00"
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
            nom=league_dto.nom,
            categoria=league_dto.categoria,
            dataInici=league_dto.dataInici,
            dataFi=league_dto.dataFi,
            status=league_dto.status,
            isActive=league_dto.isActive,
            logo_url=league_dto.logo_url,
            created_at=league_dto.created_at,
            updated_at=league_dto.updated_at
        )
        
        # 5. Devolver respuesta
        return ApiResponse(
            status=ResponseStatus.SUCCESS,
            data=league_schema,
            message="Liga '{league_schema.nom}' obtenida correctamente"
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
