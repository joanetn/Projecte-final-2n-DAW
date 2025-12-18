# Projecte Web de Gestió de Lligues de Pàdel

**Alumne:** Joan Nácher  
**Curs:** 2n DAW – IES L'Estació d'Ontinyent

---

## 1. Introducció

Este projecte consistix en el desenvolupament d'una plataforma web per a la gestió integral de lligues de pàdel. Naix amb la idea de digitalitzar processos que normalment es fan de manera manual o amb aplicacions poc especialitzades, com ara la gestió de partits, equips, classificacions i comunicació entre usuaris.

La plataforma no representa un únic club, sinó un sistema de lligues, on poden participar diferents clubs, equips i jugadors.

## 2. Objectius del projecte

* Centralitzar la informació de les lligues de pàdel.
* Gestionar equips, jugadors i rols d'usuari.
* Organitzar jornades i partits amb múltiples enfrontaments.
* Facilitar la tasca dels entrenadors amb eines visuals.
* Implementar un sistema de notificacions en temps real.
* Integrar un sistema de pagaments segur.
* Desenvolupar una arquitectura modular i escalable.

## 3. Arquitectura general del sistema

El projecte està basat en una arquitectura client-servidor amb separació clara de responsabilitats.

### Esquema general

```
Frontend                Backend                 Base de dades
---------              ---------                --------------
React                  FastAPI                  PostgreSQL
Socket.IO              Laravel
Interfície gràfica     NestJS
```

Esta separació permet que cada part del sistema evolucione de manera independent.

## 4. Backend: responsabilitat de cada servei

### FastAPI

* Gestió de lligues.
* Jornades i partits.
* Cada partit inclou 3 enfrontaments.
* Assignació de punts i càlcul del rànquing de jugadors.

### Laravel

* Gestió d'usuaris i autenticació.
* Sistema de rols i permisos.
* Gestió d'equips i clubs.
* Inscripció en lligues.
* Integració amb Stripe per als pagaments.

### NestJS

* Sistema de notificacions internes.
* Comunicació en temps real amb Socket.IO.
* Enviament de notificacions a la campaneta del frontend.

## 5. Frontend

El frontend està desenvolupat amb React, buscant una experiència moderna i intuïtiva.

### Funcionalitats destacades:

* Panell personalitzat segons el rol.
* Consulta de lligues, partits i classificacions.
* Campaneta de notificacions en temps real.
* Vista clara de resultats i estadístiques.
* **Drag and drop per a alineacions:**
   * L'entrenador veu els jugadors disponibles.
   * Arrossega els jugadors per a crear les alineacions.
   * El sistema valida automàticament.

## 6. Rols d'usuari

| Rol | Funcions |
|-----|----------|
| Jugador | Veure partits, rànquing, notificacions i pagar el segur |
| Entrenador | Convocar jugadors i crear alineacions |
| Administrador d'equip | Gestionar jugadors i inscripcions |
| Àrbitre | Crear i tancar actes de partit |
| Administrador web | Gestió general del sistema |
| Superadministrador | Control total i manteniment |

*Un mateix usuari pot tindre més d'un rol.*

## 7. Sistema de pagaments

S'utilitza **Stripe** com a passarel·la de pagament.

### Tipus de pagaments:

* Segur obligatori per a participar en una lliga.
* Compra de marxandatge de marques de pàdel.

### Flux de pagament:

```
Jugador → Frontend → Laravel → Stripe → Confirmació → Accés / Compra
```

## 8. Sistema de notificacions

* Notificacions internes, no per correu.
* Associades a cada usuari.
* Mostrades en una campaneta.
* Funcionament en temps real amb Socket.IO.

### Exemples:

* Nou partit assignat.
* Convocatòria d'un entrenador.
* Resultat publicat.
* Confirmació de pagament.

## 9. Conclusió

Este projecte ofereix una solució completa per a la gestió de lligues de pàdel, utilitzant tecnologies modernes i una arquitectura clara. Està pensat per ser escalable, mantenible i fàcil d'utilitzar, adaptant-se a diferents rols dins del món esportiu.