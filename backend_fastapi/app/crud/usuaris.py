from app.db import db

def getUsuaris():
    return db.usuario.find_many()