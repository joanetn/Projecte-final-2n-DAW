# Backend FastAPI - Ligas

Backend ligero en FastAPI con **Clean Architecture** para servir datos de ligas al frontend React.

## 📋 Estructura

```
app/
├── main.py              # Punto de entrada, crea la app FastAPI
├── config.py            # Configuraciones globales
├── dependencies.py      # Inyección de dependencias
├── shared/              # Código compartido
│   ├── database.py      # Conexión a BD
│   ├── base_model.py    # Base de SQLAlchemy
│   ├── exceptions.py    # Excepciones globales
│   └── responses.py     # Schemas de respuesta
└── modules/
    └── league/          # Módulo de ligas
        ├── domain/      # Lógica de negocio pura
        ├── application/ # Casos de uso
        ├── infrastructure/ # Acceso a datos (BD)
        └── presentation/   # Endpoints HTTP
```

## 🚀 Instalación y Uso

### 1. Entorno Virtual

```bash
# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Linux/Mac)
source venv/bin/activate
```

### 2. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar Base de Datos

Copia `.env.example` a `.env` y actualiza `DATABASE_URL`:

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/tu_base_de_datos
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Ejecutar el Servidor

```bash
# Desarrollo (con recarga automática)
uvicorn app.main:app --reload --port 8001

# O directamente
python app/main.py
```

El servidor corre en: **http://localhost:8001**

## 📚 Documentación

- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc
- **Health Check**: http://localhost:8001/health

## 🔌 Endpoints

### GET `/api/leagues`

Obtiene todas las ligas para el carrusel.

```bash
curl http://localhost:8001/api/leagues
```

**Respuesta:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "La Liga",
      "country": "España",
      "logo_url": "https://...",
      "founded_year": 1929
    }
  ],
  "message": "Ligas obtenidas correctamente"
}
```

### GET `/api/leagues/{id}`

Obtiene una liga específica.

```bash
curl http://localhost:8001/api/leagues/1
```

## 📝 Explicación Clean Architecture

### Domain Layer (`domain/`)
- **Entidades**: Representan los objetos del negocio (Liga)
- **Repositorio (interfaz)**: Contrato de qué datos necesitamos
- **Excepciones**: Errores del dominio

### Application Layer (`application/`)
- **Queries**: Casos de uso de lectura (GetAllLeaguesQuery)
- **DTOs**: Objetos para transferir datos entre capas

### Infrastructure Layer (`infrastructure/`)
- **Models**: Tablas SQLAlchemy (cómo se ve en BD)
- **Repository (implementación)**: Cómo accedemos realmente a los datos
- **Mappers**: Conversor de Models a Entities

### Presentation Layer (`presentation/`)
- **Router**: Los endpoints HTTP
- **Schemas**: Cómo se ven los datos en el JSON (API)

## 🔄 Flujo de una Petición

```
GET /api/leagues
       ↓
  [Router] - presentation/router.py
       ↓
  [Query] - application/queries.py (GetAllLeaguesQuery)
       ↓
  [Repository] - domain/repositories.py (interfaz)
       ↓
  [RepositoryImpl] - infrastructure/repository.py (implementación)
       ↓
  [Model] - infrastructure/models.py (SQLAlchemy)
       ↓
  [Base de Datos] PostgreSQL
       ↓
  [Mapper] - infrastructure/mappers.py (Model → Entity)
       ↓
  [Entity] - domain/entities.py
       ↓
  [Schema] - presentation/schemas.py
       ↓
  JSON Response
```

## 🎯 Próximos Pasos

1. ✅ Módulo de Ligas (GET todas, GET por ID)
2. ⬜ Añadir módulo de Clubes (si lo necesitas)
3. ⬜ Añadir paginación/filtros
4. ⬜ Implementar caché (Redis)
5. ⬜ Deployment en producción

## 🛠 Herramientas Usadas

- **FastAPI**: Framework web async
- **Uvicorn**: Servidor ASGI
- **SQLAlchemy**: ORM para la BD
- **Pydantic**: Validación de datos
- **PostgreSQL**: Base de datos

---

**Hecho con ❤️ en Clean Architecture**
