"""
Modelo SQLAlchemy (Infrastructure Layer)
Define cómo se ve la tabla "leagues" en la base de datos.

Importante: Este modelo es específico de SQLAlchemy y la BD.
No es igual a domain/entities.py - aquí definimos la tabla, ahí definimos la lógica.
"""

from sqlalchemy import Column, Integer, String, DateTime, func
from datetime import datetime
from app.shared.base_model import Base


class LeagueModel(Base):
    """
    Modelo SQLAlchemy que mapea la tabla 'leagues' en la BD PostgreSQL.
    
    SQLAlchemy convierte estos atributos en columnas automáticamente.
    
    Tabla en BD:
        CREATE TABLE leagues (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            logo_url TEXT,
            founded_year INTEGER,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );
    """
    
    # __tablename__ le dice a SQLAlchemy el nombre de la tabla en la BD
    # Coincide con la tabla lligues en Laravel
    __tablename__ = "lligues"
    
    # Columnas de la tabla (sincronizadas con Laravel)
    # id: UUID en Laravel
    id = Column(String(36), primary_key=True)
    
    # nom: nombre de la liga, obligatorio
    nom = Column(String(255), nullable=False, index=True)
    
    # categoria: categoría de la liga, obligatorio
    categoria = Column(String(255), nullable=False)
    
    # dataInici: fecha de inicio, obligatorio
    dataInici = Column(DateTime, nullable=False)
    
    # dataFi: fecha de fin, opcional
    dataFi = Column(DateTime, nullable=True)
    
    # status: estado de la liga, con valor por defecto
    status = Column(String(255), nullable=False, default="NOT_STARTED")
    
    # isActive: si la liga está activa
    isActive = Column(Integer, nullable=False, default=1)  # 1=True, 0=False en SQLAlchemy
    
    # logo_url: URL del logo, opcional
    logo_url = Column(String(500), nullable=True)
    
    # created_at: fecha de creación automática
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # updated_at: fecha de última actualización automática
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self) -> str:
        """Representación de debug del modelo"""
        return f"<LeagueModel(id={self.id}, name='{self.name}', country='{self.country}')>"
