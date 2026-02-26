# 🔄 BroadcastChannel - Sincronización Inter-Pestañas

## 📋 Conceptos Clave

**Problema**: Si 5 pestañas hacen una petición simultáneamente y reciben 401 (token expirado), todas intentan refrescar el token → **5 refreshes innecesarios y posibles race conditions**.

**Solución**: Usar BroadcastChannel como un "mutex" para que **solo UNA pestaña** haga el refresh y las demás esperen el resultado.

---

## 🏗️ Arquitectura

### Archivo: `src/lib/authBroadcast.ts`
```
AuthBroadcaster:
├── requestRefresh()              → ¿Esta pestaña debe hacer refresh?
├── broadcastTokenRefreshed()     → Notificar nuevo token
├── broadcastRefreshFailed()      → Notificar que falló
├── broadcastLogout()             → Notificar logout
└── broadcastLogoutAll()          → Notificar logout global
```

### Archivo: `src/context/AuthContext.tsx`
```
refreshAccessToken():
├── 1. Llamar authBroadcaster.requestRefresh()
├── 2. Si TRUE (soy responsable):
│   ├── Hacer POST /auth/refresh
│   ├── broadcastTokenRefreshed(newToken)
│   └── Retornar token
└── 3. Si FALSE (esperar):
    └── Retornar promesa que se resuelve cuando otra pestaña actualiza

Listeners de BroadcastChannel:
├── TOKEN_REFRESHED → localStorage.setItem(token)
├── TOKEN_REFRESH_FAILED → Limpiar estado
├── LOGOUT → Limpiar estado
└── LOGOUT_ALL → Limpiar estado
```

---

## 📊 Flujos de Sincronización

### Caso 1: Refresh Concurrente (5 pestañas)

```
TIEMPO → →

Pestaña 1:  [401] → requestRefresh() ✅ TRUE
            → Hacer POST /auth/refresh → broadcastTokenRefreshed("nuevo_token")
            
Pestaña 2:  [401] → requestRefresh() ❌ FALSE
            → Esperar en refreshWaitingRef
            ← Escucha TOKEN_REFRESHED → actualiza token ✅
            
Pestaña 3:  [401] → requestRefresh() ❌ FALSE
            → Esperar en refreshWaitingRef
            ← Escucha TOKEN_REFRESHED → actualiza token ✅

Pestaña 4:  (sin 401) → sin cambios

Pestaña 5:  [401] → requestRefresh() ❌ FALSE
            → Esperar en refreshWaitingRef
            ← Escucha TOKEN_REFRESHED → actualiza token ✅

RESULTADO: 1 refresh de verdad + 4 pestañas sincronizadas ✅
```

### Caso 2: Logout Global (Usuario hace logout en pestaña 1)

```
Pestaña 1 (usuario hace clic en "Logout"):
  → logout()
  → fetch POST /auth/logout
  → localStorage.removeItem('accessToken')
  → broadcastLogout()
  
Otras pestañas:
  ← Escuchan LOGOUT
  → localStorage.removeItem('accessToken')
  → setAccessToken(null)
  → setUser(null)
  → Redireccionar a login si está en ruta protegida

RESULTADO: Todas las pestañas se cierran automáticamente ✅
```

### Caso 3: Logout en Pestaña 1, Pero Pestaña 2 Intenta Llamar API

```
Pestaña 2: intenta fetch() → obtiene 401 (token inválido)
         → refreshAccessToken()
         → requestRefresh() ✅ TRUE (primera en reaccionar)
         → POST /auth/refresh ❌ FALLA (refresh_token también revocado)
         → localStorage.removeItem('accessToken')
         → broadcastRefreshFailed()
         → Limpiar estado
         
Otras pestañas:
         ← Escuchan TOKEN_REFRESH_FAILED
         → localStorage.removeItem('accessToken')
         → Ir a login

RESULTADO: Todas saben que la sesión terminó ✅
```

---

## 🔌 Cómo Usarlo

### Ejemplo en un Componente

```typescript
import { useAuth } from '@/context/AuthContext';

export function Dashboard() {
  const { user, accessToken, logout } = useAuth();

  // Este código funciona igual en 5 pestañas simultáneamente
  // Si esta pestaña recibe 401 → refresca
  // Las otras pestañas → esperan y se sincronizan

  return (
    <div>
      <h1>Hola, {user?.nom}</h1>
      <button onClick={logout}>Logout</button>
      {/* En otras pestañas → se cierra automáticamente */}
    </div>
  );
}
```

### Debugging en DevTools

```javascript
// En la consola de una pestaña:
localStorage.setItem('accessToken', 'test');

// En otra pestaña:
// Ver que se refleja automáticamente gracias a BroadcastChannel

// Si quieres logear eventos:
const ch = new BroadcastChannel('auth-channel');
ch.addEventListener('message', (e) => console.log('📡 Mensaje:', e.data));
```

---

## ⚠️ Edge Cases Manejados

| Caso | Manejo |
|------|--------|
| Pestaña se cierra mid-refresh | Timeout en otras pestañas, se reintenta |
| Token inválido en backend | broadcastRefreshFailed() → logout global |
| Múltiples logouts simultáneos | Solo ejecuta cleanup una vez per pestaña |
| localStorage no disponible | Usa accessToken en memory (useRef) |
| BroadcastChannel no soportado | Degrada a comportamiento anterior (sin sync) |

---

## 🚀 Datos Clave

- **refreshPromiseRef**: Promesa del refresh actual (evita duplicados)
- **refreshWaitingRef**: Promesa que espera resultado de otra pestaña
- **authBroadcaster.requestRefresh()**: Define quién hace el trabajo
- **BroadcastChannel('auth-channel')**: Canal de comunicación único entre pestañas

---

## ✅ Beneficios

✅ **Zero race conditions**: Una pestaña ≠ múltiples refreshes  
✅ **Sincronización automática**: Logout/token updates en todas las pestañas  
✅ **Performance**: No hay peticiones duplicadas al backend  
✅ **UX mejorada**: Usuario no ve errores de "token expirado" si otra pestaña lo maneja  
✅ **Escalable**: Funciona con N pestañas simultáneamente
