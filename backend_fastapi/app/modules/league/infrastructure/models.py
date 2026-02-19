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
    __tablename__ = "leagues"
    
    # Columnas de la tabla
    # Column(tipo_dato, argumentos)
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # name: string de máximo 255 caracteres, obligatorio
    name = Column(String(255), nullable=False, unique=True, index=True)
    
    # country: string de máximo 255 caracteres, obligatorio
    country = Column(String(255), nullable=False)
    
    # logo_url: string opcional para el URL del logo
    logo_url = Column(String(500), nullable=True)
    
    # founded_year: año de fundación (opcional)
    founded_year = Column(Integer, nullable=True)
    
    # created_at: fecha de creación, se asigna automáticamente al insertar
    created_at = Column(
        DateTime,
        default=func.now(),  # func.now() = CURRENT_TIMESTAMP en SQL
        nullable=False
    )
    
    # updated_at: fecha de última actualización, se asigna automáticamente
    updated_at = Column(
        DateTime,
        default=func.now(),  # Al insertar
        onupdate=func.now(),  # Al actualizar
        nullable=False
    )
    
    def __repr__(self) -> str:
        """Representación de debug del modelo"""
        return f"<LeagueModel(id={self.id}, name='{self.name}', country='{self.country}')>"
