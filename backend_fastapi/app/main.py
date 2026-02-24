from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.config import settings
from app.shared.responses import ApiResponse, ResponseStatus

from app.shared.database import engine
from app.shared.base_model import Base

from app.modules.league.presentation.router import router as league_router
from app.modules.league.infrastructure.models import LeagueModel 

app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    docs_url="/docs",  
    redoc_url="/redoc" 
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS, 
    allow_credentials=True, 
    allow_methods=["GET"], 
    allow_headers=["*"],  
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "validation_error",
            "message": "Error en la validación del request",
            "errors": str(exc)
        }
    )

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "environment": settings.APP_ENV}


@app.get("/", tags=["Root"])
def root():
    return ApiResponse(
        status=ResponseStatus.SUCCESS,
        message="Bienvenido a fastapi",
        data={
            "app": settings.APP_TITLE,
            "version": settings.APP_VERSION,
            "docs": "/docs",
        }
    )

app.include_router(league_router, prefix="/api")

if __name__ == "__main__":

    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=5005,
        reload=settings.DEBUG,
        log_level="info"
    )
