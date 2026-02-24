from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..application.queries import GetAllLeaguesQuery, GetLeagueByIdQuery
from ..domain.exceptions import LeagueNotFound
from ..infrastructure.repository import LeagueRepositoryImpl
from .schemas import LeagueSchema
from app.shared.database import get_db
from app.shared.responses import ApiResponse, ResponseStatus

router = APIRouter(
    prefix="/leagues",  
    tags=["Leagues"]  
)


@router.get(
    "",
    response_model=ApiResponse,
    status_code=status.HTTP_200_OK,
    summary="Obtener todas las ligas",
    description="Devuelve todas las ligas disponibles para mostrar en el carrusel del home"
)
def get_all_leagues(db: Session = Depends(get_db)):
    try:
        repository = LeagueRepositoryImpl(db)

        query = GetAllLeaguesQuery(repository)

        leagues_dtos = query.execute()

        leagues_schemas = [
            LeagueSchema(
                id=dto.id,
                nom=dto.nom,
                categoria=dto.categoria,
                dataInici=dto.dataInici,
                dataFi=dto.dataFi,
                status=dto.status,
                logo_url=dto.logo_url,
            )
            for dto in leagues_dtos
        ]

        return ApiResponse(
            status=ResponseStatus.SUCCESS,
            data=leagues_schemas,
            message="Ligas obtenidas correctamente"
        )
    
    except Exception as e:
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
    try:
        repository = LeagueRepositoryImpl(db)

        query = GetLeagueByIdQuery(repository)

        league_dto = query.execute(league_id)

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

        return ApiResponse(
            status=ResponseStatus.SUCCESS,
            data=league_schema,
            message="Liga '{league_schema.nom}' obtenida correctamente"
        )
    
    except LeagueNotFound as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.message
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener liga: {str(e)}"
        )
