from fastapi import Depends
from prisma import Prisma

db = Prisma()

async def get_db():
    if not db.is_connected():
        await db.connect()
    try:
        yield db
    finally:
        await db.disconnect()