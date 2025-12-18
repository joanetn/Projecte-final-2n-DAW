from fastapi import FastAPI
from app.api.v1.router import api_router
from app.core.config import settings
from app.db import db
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()
    
app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION, lifespan=lifespan)
@app.get("/")
def root():
    return {"status": "ok", "NOM": app.title, "VERSION": app.version}
