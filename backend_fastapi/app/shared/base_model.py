from sqlalchemy.orm import declarative_base

# declarative_base() crea una clase base que todos los modelos heredarán
# Esto permite a SQLAlchemy registrar automáticamente todas las tablas
Base = declarative_base()
