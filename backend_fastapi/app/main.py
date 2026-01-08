from fastapi import FastAPI
from app.core.config import settings
from app.db import db
from app.routes import liga, jornada, partit, puntuacio
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent
load_dotenv(env_path)
@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION, lifespan=lifespan)
app.include_router(liga.router, prefix="/ligas", tags=["Ligas"])
app.include_router(jornada.router, prefix="/jornadas", tags=["Jornadas"])
app.include_router(partit.router, prefix="/partits", tags=["Partits"])
app.include_router(puntuacio.router, prefix="/puntuacions", tags=["Puntuacions"])
@app.get("/")
def root():
    return {"status": "ok", "NOM": app.title, "VERSION": app.version}

