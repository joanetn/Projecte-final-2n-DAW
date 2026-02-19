from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from datetime import datetime
from app.shared.base_model import Base


class LeagueModel(Base):
    __tablename__ = "lligues"

    id = Column(String(36), primary_key=True)

    nom = Column(String(255), nullable=False, index=True)

    categoria = Column(String(255), nullable=False)

    dataInici = Column(DateTime, nullable=False)

    dataFi = Column(DateTime, nullable=True)

    status = Column(String(255), nullable=False, default="NOT_STARTED")

    isActive = Column(Boolean, nullable=False, default=True)

    logo_url = Column(String(500), nullable=True)

    created_at = Column(DateTime, default=func.now(), nullable=False)

    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self) -> str:
        return f"<LeagueModel(id={self.id}, name='{self.name}', categoria='{self.categoria}')>"
