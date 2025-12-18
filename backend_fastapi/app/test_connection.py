import asyncio
from app.db import db

async def test_connection():
    await db.connect()
    print("Conectado a la BD ✅")
    await db.disconnect()
    print("Desconectado ✅")

asyncio.run(test_connection())
