# 🧪 Pruebas y Debugging de BroadcastChannel

## 📝 Cómo Verificar que Funciona

### 1️⃣ **Test Local: Refresh Concurrente**

Abre **3 pestañas** del mismo navegador:

```
Pestaña 1: http://localhost:5173/profile
Pestaña 2: http://localhost:5173/dashboard
Pestaña 3: http://localhost:5173/settings
```

Después, en **DevTools** de cada pestaña (F12):

```javascript
// En la consola de Pestaña 1
localStorage.setItem("accessToken", "test-old-token-1");

// En la consola de Pestaña 2 y 3, verificar que se ve reflejado
console.log(localStorage.getItem("accessToken")); 
// → "test-old-token-1" (sincronizado)
```

### 2️⃣ **Test de Logout Global**

En **Pestaña 1**:
1. Haz clic en el botón **"Logout"**
2. Observa que se limpia el estado

In **Pestaña 2 y 3** (sin hacer nada):
- Automáticamente se redirigen a `/login`
- El token desaparece del state

### 3️⃣ **Monitor de Mensajes en Consola**

En la consola de cualquier pestaña:

```javascript
// Crear un listener para ver todos los mensajes
const channel = new BroadcastChannel('auth-channel');
channel.addEventListener('message', (event) => {
    console.log('📡 Mensaje recibido:', event.data);
});

// Ahora cuando otra pestaña haga logout, verás:
// 📡 Mensaje recibido: {type: 'LOGOUT', timestamp: 1234567890}
```

---

## 🔍 Debugging Advanced

### Verificar que Solo UNA Pestaña Refresca

En `src/lib/authBroadcast.ts`, agregar logs:

```javascript
// En requestRefresh()
requestRefresh(): boolean {
    if (this.refreshInProgress) {
        console.log('🟡 [BroadcastChannel] Esperando refresh de otra pestaña...');
        this.waitingForRefresh = true;
        return false;
    }

    console.log('🟢 [BroadcastChannel] Esta pestaña hará el refresh');
    this.refreshInProgress = true;
    return true;
}

// En broadcastTokenRefreshed()
broadcastTokenRefreshed(token: string) {
    if (!this.channel) return;

    console.log('📤 [BroadcastChannel] Notificando TOKEN_REFRESHED a otros');
    // ... resto del código
}
```

Ahora cuando abras 3 pestañas y una reciba 401:

```
Pestaña 1: 🟢 [BroadcastChannel] Esta pestaña hará el refresh
Pestaña 1: 📤 [BroadcastChannel] Notificando TOKEN_REFRESHED a otros

Pestaña 2: 🟡 [BroadcastChannel] Esperando refresh de otra pestaña...
Pestaña 3: 🟡 [BroadcastChannel] Esperando refresh de otra pestaña...
```

### Monitorear Storage Events

El storage change también se puede escuchar:

```javascript
window.addEventListener('storage', (e) => {
    if (e.key === 'accessToken') {
        console.log('📦 Storage cambió:', {
            oldValue: e.oldValue,
            newValue: e.newValue,
            url: e.url
        });
    }
});
```

---

## ✅ Checklist de Validación

- [ ] Abrir 3 pestañas con la app logueada
- [ ] Hacre logout en Pestaña 1 → Pestaña 2 y 3 se desloguean automáticamente
- [ ] Hacer logout en Pestaña 2 (mientras Pestaña 1 estaba en background) → Pestaña 1 se desloguea
- [ ] En DevTools, ver que `localStorage.getItem('accessToken')` es igual en todas las pestañas
- [ ] Hacer 2 peticiones simultáneamente en tab1 y tab2 que obtengan 401 → solo 1 refresh acontece
- [ ] Cerrar una pestaña mid-refresh → las otras sigue funcionando
- [ ] Cambiar a pestaña diferente mienatra hace refresh → sigue sincronizado

---

## 🐛 Problemas Comunes y Soluciones

### Problema: Las pestañas no se sincronizan

**Causa posible**: BroadcastChannel no está activado en tu navegador.

**Solución**:
```javascript
// Verifica en consola:
console.log(typeof BroadcastChannel); // → "function" si está disponible
```

**Navegadores compatibles**:
- ✅ Chrome/Edge 54+
- ✅ Firefox 38+
- ✅ Safari 15.1+
- ❌ IE 11 (no soportado, usa polyfill o degrada gracefully)

### Problema: localStorage persiste pero el state no se actualiza

**Causa**: Los listeners de BroadcastChannel están mal conectados.

**Solución**: Verificar que el `useEffect` en AuthContext llama a `authBroadcaster.onMessage()`:

```typescript
useEffect(() => {
    // ← Este bloque debe ejecutarse
    authBroadcaster.onMessage(handleBroadcastMessage);
    // ← Si está aquí, funcionará
}, []);
```

### Problema: Logout en pestaña no afecta a otras

**Causa**: `broadcastLogout()` no se está llamando.

**Solución**: Verificar que el logout llama a:

```typescript
authBroadcaster.broadcastLogout(); // ← Debe estar en la función logout()
```

---

## 📊 Performance Metrics

### Antes de BroadcastChannel
```
5 pestañas + 1 error 401
= 5 × POST /auth/refresh = ❌ 5 backend calls
```

### Con BroadcastChannel
```
5 pestañas + 1 error 401
= 1 × POST /auth/refresh + 4 × localStorage = ✅ 1 backend call
```

**Mejora**: 500% menos carga en backend

---

## 🚀 Próximos Pasos

1. **Agregar retry logic** si BroadcastChannel falla
2. **Persistencia entre sesiones**: SessionStorage también
3. **IndexedDB sync**: Para datos más complejos
4. **Service Worker**: Sincronización aún más robusta
