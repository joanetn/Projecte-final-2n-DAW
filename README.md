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
                               │  :8001 User       :8006 Lineup                   │
                               │  :8002 Club       :8007 Invitation               │
                               │  :8003 League     :8008 Merchandise              │
                               │  :8004 Match      :8009 Insurance                │
                               │  :8005 Venue      :8010 Notifications            │
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
| **Insurance** | 8009 | Segurs obligatoris de jugadors amb Stripe. |
| **Notifications** | 8010 | Cua, processat IA i consulta de notificacions per usuari. |
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

## 10. Notificacions (actual + flux realtime preferit)

### 10.1 Base de dades de notificacions

La taula `notificacions` guarda, com a mínim:

- `id` (uuid)
- `user_id` (usuari destinatari)
- `status` (`PENDENT`, `COMPLETADA`, `ERROR`)
- `tone` (`PROFESIONAL`, `INFORMAL`, `URGENTE`)
- `urgencia` (`BAJA`, `NORMAL`, `ALTA`, `CRITICA`)
- `suceso` (resum de l'event)
- `llegit` (`true`/`false`)
- `channels` (array: `Email`, `WhatsApp`, `SMS`, `Push`)
- `data` (context extra + resultats de processat IA)

### 10.2 Endpoints del mòdul (JWT obligatori)

- `GET /api/notifications/me`: notificacions de l'usuari autenticat.
- `GET /api/notifications/user/{userId}`: només permès si `auth_user_id === userId`.
- `POST /api/notifications/enqueue`: encolar notificació manual.
- `POST /api/notifications/process-next`: processar la pendent més antiga.
- `PATCH /api/notifications/{id}/read`: marcar com llegida.

### 10.3 Flux ACTUAL implementat (el que està en producció local)

1. Es crea invitació amb `POST /api/invitacions`.
2. `InvitationController::storeInvitacio()` valida permisos i construeix `CreateInvitacioEquipDTO`.
3. `CreateInvitacioEquipCommand::execute()` valida segur, evita duplicats, crea invitació i crida `dispatchInvitationNotification()`.
4. `dispatchInvitationNotification()` prepara `suceso`, `channels=['Push']`, `tone` i `data` contextual.
5. `EnqueueNotificationCommand::execute()`:
   - calcula urgència amb IA (Groq),
   - guarda registre `PENDENT` en BD,
   - emet event de broadcast (`queued`).
6. En el mateix flux es crida `ProcessNextCommand::execute()` immediatament.
7. `ProcessNextCommand` processa canals amb un provider IA (Groq/Cerebras/Cohere/OpenRouter/Gemini/Mistral), guarda `deliveries` en `data` i actualitza a `COMPLETADA` o `ERROR`.
8. Emet event de broadcast (`processed`).
9. Frontend (`NotificationBell`) refresca amb polling (`GET /api/notifications/me` cada 3s) i pinta comptador + llista.

### 10.4 Flux REALTIME preferit (el que proposes, estil event-driven pur)

Este disseny és el recomanat per a temps real estricte:

1. Endpoint de generació (`POST /generate` o equivalent al mòdul).
2. `NotificationService`:
   - resol provider IA via `AIManager`,
   - genera text final,
   - guarda notificació en BD,
   - emet event `AINotificationGenerated`.
3. Event `AINotificationGenerated implements ShouldBroadcast`:
   - canal privat `user.{user_id}`,
   - nom d'event `ai.notification`.
4. Frontend amb Echo:
   - subscripció a `private(user.{id})`,
   - `listen('.ai.notification')`,
   - pinta la notificació en UI sense esperar polling.

Flux resumit:

`POST /generate` → `NotificationService` → IA → guarda BD → `AINotificationGenerated` → WebSocket → campaneta.

### 10.5 Opcions PRO recomanades

- Emetre event només en canals realtime (`push`, `in_app`).
- Guardar en BD abans d'emetre sempre (font de veritat consistent).
- Mantindre fallback per polling per si falla WebSocket.
- Si usuari offline: integrar FCM/APNs per push mòbil real.

### 10.6 Diferència clau entre els dos enfocaments

- Estat actual: backend sí emet events, però frontend actualitza principalment per polling (cada 3s).
- Estat objectiu: frontend subscrit a Echo/Pusher i recepció immediata real sense dependre del polling.

Això permet una transició segura: primer estabilitat (polling), després realtime complet (Echo + canal privat + push offline).

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
| pf_svc_user … pf_svc_notifications | laravel custom | 8001–8010 |
| pf_fastapi | python 3.12 custom | 5005 |
| pf_frontend | nginx:alpine (build React) | 3000 |

Consulta [DOCKER_INSTRUCCIONES.md](DOCKER_INSTRUCCIONES.md) per a la guia completa de posada en marxa.
