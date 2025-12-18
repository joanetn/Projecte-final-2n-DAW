from fastapi import FastAPI
from app.core.config import settings
from app.db import db
from app.routes import usuaris
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()
    
app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION, lifespan=lifespan)
app.include_router(usuaris.router, prefix="/usuaris", tags=["Usuaris"])
@app.get("/")
def root():
    return {"status": "ok", "NOM": app.title, "VERSION": app.version}


