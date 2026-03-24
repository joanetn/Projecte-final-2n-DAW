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
                               │                                                  │
                               │  :8001 User       :8005 Venue                    │
                               │  :8002 Club       :8006 Lineup                   │
                               │  :8003 League     :8007 Invitation               │
                               │  :8004 Match      :8008 Merchandise              │
                               └──────────────────────────────────────────────────┘
                                       │
                       ┌───────────────┴─────────────────┐
                       │                                 │
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
| **Insurance** | — | Segurs obligatoris de jugadors amb Stripe. |
| **AdminWeb** | — | Gestió administrativa de lligues, equips, rondes i propostes de canvi de data. |

### Tecnologies Laravel
- **Autenticació:** JWT (`tymon/jwt-auth`) amb suport per a rol exclusiu ARBITRE.
- **Documentació API:** Swagger (`darkaonline/l5-swagger`)
- **Pagaments:** `stripe/stripe-php` 
- **Arquitectura interna:** Clean Architecture (Domain / Application / Infrastructure / Presentation)
- **Patrons:** Repository Pattern, Mapper Pattern, DTO Pattern

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

Un mateix usuari pot tenir més d'un rol simultàniament, **excepte ARBITRE que és exclusiu**.

| Rol | Capacitats principals | Notes |
|---|---|---|
| **Jugador** | Consultar partits, rànquing, pagar segur, comprar marxandatge | Únic rol amb accés a pagament de segur |
| **Entrenador** | Crear alineacions, convocar jugadors | |
| **Admin equip** | Gestionar membres, invitar jugadors, inscriure equip a lligues | |
| **Àrbitre** | Obrir i tancar actes de partit, registrar resultats | ⚠️ Rol exclusiu — no pot combinar-se amb altres |
| **Admin web** | Gestió completa del sistema des del panell d'administració | |

### Rol ARBITRE exclusiu
- A nivell de registre: si selecciona ARBITRE, automàticament es desactiven les altres opcions de rol.
- Validació de doble capa (frontend + backend) per garantir que no es crei usuari ARBITRE amb altres rols.
- Aplicat a través del sistema de `UsuariRol` amb flags `isActive`.

---

## 8. Noves funcionalitats implementades (Q1 2026)

### 8.1 Restricció de pagament de segur (player-only)
- Només els usuaris amb rol **JUGADOR** actiu poden crear o confirmar pagaments de segur.
- Validació implementada a nivell de controller (`InsuranceController`):
  - Endpoint `POST /seguros` retorna **403 Forbidden** si l'usuari no és JUGADOR.
  - Endpoint `POST /seguros/confirm` retorna **403 Forbidden** si l'usuari no és JUGADOR.
- Query d'accés: `UsuariRol::where('rol', 'JUGADOR')->where('isActive', true)`

### 8.2 Rol ARBITRE exclusiu
- **Frontend:** Selector de rols amb lògica d'exclusivitat — seleccionar ARBITRE desactiva altres rols automàticament.
- **Backend:** Doble validació:
  - `RegisterRequest::withValidator()` rebutja combinacions d'ARBITRE amb altres rols.
  - `RegisterCommand::normalizeRoles()` força ARBITRE a ser l'únic rol si està present.

### 8.3 Millora d'alineacions amb drag-and-drop avançat
- **Interaccions suportades:**
  1. **Drag desde llista disponible:** Arrossega un jugador → Deixa caure en slot lliure o ocupat → Assignació/reemplaçament.
  2. **Drag entre slots:** Arrossega jugador des de slot ocupat → Deixa caure en altre slot → Intercanvi (swap).
  3. **Click-to-assign:** Clica jugador (visual ring) → Clica slot → Assignació automàtica.
- **Guards:** Els jugadors sense segur mostren estat "sin-segur" i no es poden seleccionar ni assignar.
- **Millors visuals:** Nom de jugador seleccionat destaca amb anell blue, icona de "grip" en slots ocupats.

### 8.4 Infraestructura AdminWeb (Layer pattern)
- Nou mòdul `AdminWeb` amb abstracció de models i mappers:
  - **Models:** `LeagueModel`, `TeamModel`, `RoundModel`, `MatchModel`, `RescheduleProposalModel`, `TeamUserModel`
  - **Mappers:** `TeamMapper`, `RescheduleProposalMapper`
  - **Repository:** `EloquentAdminLeaguePlannerRepository` actualitzat per utilitzar models encapsulats.
- Permet gestió de propostes de canvi de data (`proposta_canvi_data_partits`) amb validació de disponibilitat d'equips.

---

## 9. Pagaments amb Stripe

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

## 10. Notificacions

- Notificacions internes associades a cada usuari (sense correu electrònic).
- Mostrades en una campaneta al frontend.
- Exemples: invitació d'equip, convocatòria, resultat publicat, confirmació de pagament.

---

## 11. Desplegament amb Docker

```bash
# Iniciar tots els serveis
docker compose up -d

# Executar migracions (primera vegada)
docker exec pf_gateway php artisan migrate --seed

# Veure logs d'un servei
docker compose logs -f gateway
```

### Stripe webhook forward (carrito + seguros) amb Docker

```bash
# Arrancar listener Stripe únic (carrito + seguros)
docker compose --profile stripe up stripe_webhook
```

Notes:
- El listener mostrarà una línia amb `whsec_...` (webhook signing secret).
- Copia eixe valor a `backend_laravel/.env` com `STRIPE_WEBHOOK_SECRET`.
- Recarrega contenidors Laravel perquè agafen el nou secret (`docker compose up --build`).

### Serveis del compose

| Contenidor | Imatge | Port host |
|---|---|---|
| pf_postgres | postgres:16-alpine | 5433 |
| pf_gateway | laravel custom | 8000 |
| pf_svc_user … pf_svc_merchandise | laravel custom | 8001–8008 |
| pf_fastapi | python 3.12 custom | 5005 |
| pf_frontend | nginx:alpine (build React) | 3000 |

Consulta [DOCKER_INSTRUCCIONES.md](DOCKER_INSTRUCCIONES.md) per a la guia completa de posada en marxa.
