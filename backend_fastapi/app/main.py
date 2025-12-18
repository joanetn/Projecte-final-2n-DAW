from fastapi import FastAPI
from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(
    tittle=settings.PROJECT_NAME,
    version=settings.VERSION
)

app.include_router(api_router)

@app.get("/")
def root():
    return {"status": "ok"}