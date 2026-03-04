# 🐳 Docker — Guía de despliegue

## Arquitectura

| Servicio | Puerto | Descripción |
|---|---|---|
| **postgres** | 5432 | PostgreSQL 16 |
| **gateway** | 8000 | Laravel — API Gateway (proxea a los microservicios) |
| **svc_user** | 8001 | Laravel — User Service |
| **svc_club** | 8002 | Laravel — Club Service |
| **svc_league** | 8003 | Laravel — League Service |
| **svc_match** | 8004 | Laravel — Match Service |
| **svc_venue** | 8005 | Laravel — Venue Service |
| **svc_lineup** | 8006 | Laravel — Lineup Service |
| **svc_invitation** | 8007 | Laravel — Invitation Service |
| **svc_merchandise** | 8008 | Laravel — Merchandise Service |
| **backend_fastapi** | 5005 | FastAPI (Microservicio Leagues alternativo) |
| **frontend** | 3000 | React 19 + Vite (servido por Nginx) |

> Todos los microservicios Laravel comparten la misma imagen Docker pero arrancan en puertos diferentes. El gateway tiene `GATEWAY_ENABLED=true` y el resto `GATEWAY_ENABLED=false`.

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución
- Git (para clonar el repositorio)

---

## 1. Cambios necesarios ANTES de hacer build

### 1.1 Laravel — `.env` ya existe

El proyecto ya tiene un `.env` con `APP_KEY` y `JWT_SECRET` generados. El `docker-compose.yml` usa esos mismos valores por defecto, así que **no necesitas generar nada nuevo**.

Sin embargo, las variables de conexión a BD y URLs de microservicios del `.env` local apuntan a `localhost`, y dentro de Docker deben apuntar a los nombres de los contenedores. **No hace falta tocar el `.env`** porque el `docker-compose.yml` sobreescribe esas variables con `environment:`.

> **Resumen: no necesitas tocar el `.env` de Laravel.** Docker Compose inyecta las variables correctas.

### 1.2 Frontend — URLs de los backends

El archivo `frontend_final/src/api/axios.ts` tiene las URLs hardcodeadas:

```typescript
export const laravel = axios.create({
    baseURL: "http://localhost:8000",  // ← OK, coincide con el gateway
    withCredentials: true
})

export const fastapi = axios.create({
    baseURL: "http://localhost:5005",  // ← OK, coincide con FastAPI
    withCredentials: true
})
```

> Ya coinciden con los puertos del compose. **No necesitas cambiar nada** si usas tu PC local.

### 1.3 Credenciales de la BD en Docker

El compose crea PostgreSQL con estas credenciales (diferentes a las de tu `.env` local):

| Campo | Valor en Docker |
|---|---|
| Host | `postgres` (entre contenedores) / `localhost` (desde tu PC) |
| Puerto | 5432 |
| Base de datos | `projecte_final` |
| Usuario | `projecte` |
| Contraseña | `projecte_pass` |

> Si quieres usar las mismas credenciales que tu `.env` local (`postgres` / `1234`), edita las variables `POSTGRES_USER`, `POSTGRES_PASSWORD` en el servicio `postgres` del compose y actualiza las del resto de servicios para que coincidan.

---

## 2. Puesta en marcha

```bash
# Desde la raíz del proyecto (donde está docker-compose.yml)

# 1. Construir las imágenes
docker compose build

# 2. Levantar todos los servicios
docker compose up -d

# 3. Ejecutar migraciones (solo la primera vez)
docker compose exec gateway php artisan migrate --force

# 4. (Opcional) Ejecutar seeders
docker compose exec gateway php artisan db:seed --force
```

---

## 3. Verificar que todo funciona

| Servicio | URL | Esperado |
|---|---|---|
| Frontend | http://localhost:3000 | Interfaz de React |
| Gateway health | http://localhost:8000/api/gateway/health | `{"status": "ok"}` |
| Gateway services | http://localhost:8000/api/gateway/services | Lista de microservicios |
| User Service | http://localhost:8001/api/usuaris | Respuesta directa |
| Club Service | http://localhost:8002/api/clubs | Respuesta directa |
| League Service | http://localhost:8003/api/lligues | Respuesta directa |
| FastAPI Docs | http://localhost:5005/docs | Swagger UI |
| FastAPI Health | http://localhost:5005/health | `{"status": "ok"}` |

---

## 4. Comandos útiles

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un microservicio específico
docker compose logs -f svc_user
docker compose logs -f gateway

# Parar todo
docker compose down

# Parar todo y BORRAR volúmenes (resetear BD)
docker compose down -v

# Reconstruir solo un servicio
docker compose build gateway
docker compose up -d gateway

# Entrar dentro de un contenedor
docker compose exec gateway bash
docker compose exec backend_fastapi bash

# Ejecutar comando artisan en cualquier servicio
docker compose exec gateway php artisan migrate:status
docker compose exec svc_user php artisan route:list

# Levantar solo algunos servicios (ej: solo gateway + user + postgres)
docker compose up -d postgres gateway svc_user
```

---

## 5. Solución de problemas

### El frontend no conecta con los backends
- Los backends se exponen en los puertos **8000** y **5005** de tu máquina.
- El frontend se comunica desde **tu navegador** (no desde el contenedor), así que `http://localhost:8000` debe ser alcanzable desde tu PC.

### Error "SQLSTATE connection refused" en Laravel
- Dentro de Docker, el host de la BD es `postgres` (nombre del servicio), no `localhost`. El compose ya lo configura bien.

### Error "relation does not exist"
- Ejecuta las migraciones: `docker compose exec gateway php artisan migrate --force`

### FastAPI no conecta con la BD
- Verifica que `DATABASE_URL` use `postgres` como host. Ya está configurado en el compose.

### Un microservicio falla pero los demás siguen funcionando
- Esa es la gracia de la arquitectura. Puedes reiniciar solo el servicio caído:
  ```bash
  docker compose restart svc_league
  ```

---

## 6. Actualizar código durante desarrollo (sin reconstruir todo)

Cuando estás programando y quieres probar tus cambios en Docker sin esperar un `docker compose build` completo:

### Backend Laravel (gateway o cualquier microservicio)

Solo necesitas copiar los archivos que has cambiado al contenedor y ya:

```bash
# Copiar un archivo concreto al gateway
docker cp backend_laravel/app/Http/Controllers/MiController.php pf_gateway:/var/www/html/app/Http/Controllers/MiController.php

# Copiar una carpeta entera (ej: un módulo completo)
docker cp backend_laravel/app/Modules/User/. pf_svc_user:/var/www/html/app/Modules/User/

# Si tocas rutas o config, limpia la caché:
docker compose exec gateway php artisan optimize:clear
```

> **Truco rápido:** Si cambias código PHP no hace falta reiniciar nada, `artisan serve` lo detecta automáticamente. Solo limpia caché si tocas config o rutas.

### Backend FastAPI

```bash
# Copiar archivo concreto
docker cp backend_fastapi/app/modules/league/presentation/router.py pf_fastapi:/app/app/modules/league/presentation/router.py

# Reiniciar el servicio (uvicorn sin --reload en producción)
docker compose restart backend_fastapi
```

### Frontend (requiere rebuild parcial)

El frontend es una build estática (Nginx), así que necesitas reconstruir solo ese servicio:

```bash
# Rebuild SOLO el frontend (rápido gracias al cache de capas Docker)
docker compose build frontend && docker compose up -d frontend
```

### Método más rápido para todo: rebuild selectivo

```bash
# Reconstruir SOLO el servicio que has tocado (mucho más rápido que build completo)
# IMPORTANTE: Usa el nombre del servicio (en docker-compose.yml), NO el container_name
# Los nombres de servicios son: gateway, svc_user, svc_club, svc_league, etc, frontend, backend_fastapi
docker compose build <servicio> && docker compose up -d <servicio>

# Ejemplos:
docker compose build gateway && docker compose up -d gateway
docker compose build svc_user && docker compose up -d svc_user
docker compose build backend_fastapi && docker compose up -d backend_fastapi
docker compose build frontend && docker compose up -d frontend
```

> Docker cachea las capas que no han cambiado (dependencias, etc.), así que solo reconstruye la parte del código nuevo. Suele tardar pocos segundos.
>
> ⚠️ **Nota:** Los nombres de los SERVICIOS (para docker compose) son diferentes de los `container_name`. Los servicios son: `gateway`, `svc_user`, `svc_club`, etc. Los container_name tienen prefijo `pf_` pero eso es solo para identificar los contenedores.
