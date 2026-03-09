# Plataforma de Gestió de Lligues de Pàdel

**Alumne:** Joan Nácher  
**Curs:** 2n DAW – IES L'Estació d'Ontinyent

---

## 1. Introducció

Plataforma web per a la gestió integral de lligues de pàdel. Digitalitza processos habituals com la gestió de partits, equips, classificacions, alineacions i comunicació entre usuaris.

El sistema no representa un únic club: és una plataforma on poden participar diversos clubs, equips i jugadors d'una mateixa lliga.

---

## 2. Objectius

- Centralitzar la informació de lligues, equips i jugadors.
- Gestionar jornades, partits i classificació automàtica.
- Facilitar la creació d'alineacions als entrenadors.
- Implementar un sistema de notificacions intern.
- Integrar pagaments amb Stripe (segur obligatori i marxandatge).
- Arquitectura modular, escalable i dockeritzada.

---

## 3. Arquitectura del sistema

```
┌─────────────┐     HTTP       ┌──────────────────────────────────────────────┐
│             │ ────────────►  │  Gateway Laravel (port 8000)                 │
│  Frontend   │                │  Enruta a microservei corresponent           │
│  React+Vite │                └──────┬───────────────────────────────────────┘
│  port 3000  │                       │ proxy intern Docker
└─────────────┘                ┌──────▼───────────────────────────────────────────┐
                                │  Microserveis Laravel (un procés per mòdul)      │
                                │                                                   │
                                │  :8001 User       :8005 Venue                    │
                                │  :8002 Club       :8006 Lineup                   │
                                │  :8003 League     :8007 Invitation               │
                                │  :8004 Match      :8008 Merchandise              │
                                └──────────────────────────────────────────────────┘
                                       │
                       ┌───────────────┴─────────────────┐
                       │                                  │
                ┌──────▼──────────────┐    ┌─────────────▼──────────┐
                │  FastAPI (port 5005)│    │  PostgreSQL 16         │
                │  Mòdul Lligues      │    │  (port 5433 en host)   │
                └─────────────────────┘    └────────────────────────┘
```

Tot el sistema es desplega amb **Docker Compose** (`docker compose up`).

---

## 4. Backend Laravel — microserveis

Codi únic Laravel 12 (PHP 8.2) que s'executa com a múltiples processos independents. Cada procés gestiona un mòdul, de manera que si un falla la resta continuen funcionant.

| Mòdul | Port | Responsabilitat |
|---|---|---|
| **Gateway** | 8000 | Punt d'entrada únic. Enruta les peticions als microserveis. |
| **User** | 8001 | Registre, login (JWT), perfil, nivells, rols d'usuari. |
| **Club** | 8002 | Gestió de clubs i membres d'equip. |
| **League** | 8003 | Lligues, jornades i inscripcions d'equips. |
| **Match** | 8004 | Partits, actes, resultats i puntuacions. |
| **Venue** | 8005 | Instal·lacions i pistes. |
| **Lineup** | 8006 | Alineacions i convocatòries per partit. |
| **Invitation** | 8007 | Invitacions d'equip entre usuaris. |
| **Merchandise** | 8008 | Productes i compres amb Stripe. |
| **Insurance** | — | Segurs obligatoris de jugadors amb Stripe. *(en curs)* |

### Tecnologies Laravel
- **Autenticació:** JWT (`tymon/jwt-auth`)
- **Documentació API:** Swagger (`darkaonline/l5-swagger`)
- **Pagaments:** `stripe/stripe-php`
- **Arquitectura interna:** Clean Architecture (Domain / Application / Infrastructure / Presentation)

---

## 5. Backend FastAPI

Servei Python independent (FastAPI + SQLAlchemy + uvicorn) que gestiona el mòdul de **Lligues**.

- Port: **5005**
- BD: PostgreSQL compartida amb Laravel
- Arquitectura: Clean Architecture per mòduls

---

## 6. Frontend

Aplicació SPA desenvolupada amb **React 19 + Vite 7 + TypeScript**.

### Tecnologies principals

| Eina | Ús |
|---|---|
| Tailwind CSS 4 + shadcn/ui | Estils i components |
| TanStack Query | Gestió d'estat del servidor i caché |
| React Router 7 | Enrutament |
| Axios | Peticions HTTP |

### Pàgines i funcionalitats

| Secció | Contingut |
|---|---|
| Login / Registre | Autenticació JWT amb refresc automàtic de token |
| Home | Vista general de lligues i partits actius |
| Perfil | Edició de dades personals i avatar |
| Panell jugador | Partits, classificació, segur i notificacions |
| Panell entrenador | Gestió d'alineacions amb drag & drop |
| Panell admin equip | Membres, invitacions i inscripcions |
| Panell àrbitre | Creació i tancament d'actes de partit |
| Panell admin web | Gestió global: usuaris, lligues, clubs, pagaments, seguros |

---

## 7. Rols d'usuari

Un mateix usuari pot tenir més d'un rol simultàniament.

| Rol | Capacitats principals |
|---|---|
| **Jugador** | Consultar partits, rànquing, pagar segur, comprar marxandatge |
| **Entrenador** | Crear alineacions, convocar jugadors |
| **Admin equip** | Gestionar membres, invitar jugadors, inscriure equip a lligues |
| **Àrbitre** | Obrir i tancar actes de partit, registrar resultats |
| **Admin web** | Gestió completa del sistema des del panell d'administració |

---

## 8. Pagaments amb Stripe

### Segur obligatori
- Necessari per participar en partits de lliga.
- Flux: frontend sol·licita `PaymentIntent` → Stripe → webhook confirma → `pagat = true` a la BD.
- Idempotència garantida per `stripe_payment_intent_id UNIQUE`.

### Marxandatge
- Compra de productes del catàleg amb el mateix patró de pagament.

```
Usuari → Frontend → Gateway (8000) → svc_merchandise / svc_insurance
                                             │
                                        Stripe API
                                             │
                                   Webhook → confirma pagament
```

---

## 9. Notificacions

- Notificacions internes associades a cada usuari (sense correu electrònic).
- Mostrades en una campaneta al frontend.
- Exemples: invitació d'equip, convocatòria, resultat publicat, confirmació de pagament.

---

## 10. Desplegament amb Docker

```bash
# Iniciar tots els serveis
docker compose up -d

# Executar migracions (primera vegada)
docker exec pf_gateway php artisan migrate --seed

# Veure logs d'un servei
docker compose logs -f gateway
```

### Serveis del compose

| Contenidor | Imatge | Port host |
|---|---|---|
| pf_postgres | postgres:16-alpine | 5433 |
| pf_gateway | laravel custom | 8000 |
| pf_svc_user … pf_svc_merchandise | laravel custom | 8001–8008 |
| pf_fastapi | python 3.12 custom | 5005 |
| pf_frontend | nginx:alpine (build React) | 3000 |

Consulta [DOCKER_INSTRUCCIONES.md](DOCKER_INSTRUCCIONES.md) per a la guia completa de posada en marxa.
