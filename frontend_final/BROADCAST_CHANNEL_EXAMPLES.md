# 💡 Ejemplos Prácticos

## 1. Dashboard con Sincronización Automática

```typescript
// src/pages/Home.tsx
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export function Home() {
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    // El componente automáticamente:
    // - Se actualiza cuando otra pestaña hace logout
    // - Sincroniza el token cuando otra pestaña lo refresca
    // - NO hace refresh duplicado

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <div>No autorizado - Inicia sesión</div>;
    }

    return (
        <div>
            <h1>Bienvenido, {user?.nom}</h1>
            <p>Email: {user?.email}</p>

            <button onClick={logout} className="btn btn-danger">
                Logout
            </button>

            {/* Si haces logout AQUÍ, las otras pestañas se desloguean automáticamente */}
        </div>
    );
}
```

---

## 2. Componente que Hace Peticiones API

```typescript
// src/components/UserProfile.tsx
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export function UserProfile() {
    const { apiCall, isAuthenticated } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                // apiCall automáticamente:
                // 1. Añade authorization header
                // 2. Si recibe 401, detecta si es token expirado
                // 3. Llama a refreshAccessToken()
                // 4. Si estoy en pestaña 2, espero que pestaña 1 refresque
                // 5. Reenta la petición con el nuevo token
                const result = await apiCall('/api/profile');
                setData(result);
                setError(null);
            } catch (err) {
                // Si el refresh falló, logout automático
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, apiCall]);

    if (loading) return <div>Cargando perfil...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>Sin datos</div>;

    return (
        <div>
            <h2>{data.user.nom}</h2>
            <p>{data.user.email}</p>
        </div>
    );
}
```

---

## 3. Logout Component

```typescript
// src/components/LogoutButton.tsx
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout(); // Notifica a otras pestañas vía BroadcastChannel
            navigate('/login');
        } catch (err) {
            console.error('Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleLogout} disabled={isLoading}>
            {isLoading ? '...' : 'Logout'}
        </button>
    );
}

// Nota: En Pestaña 1 = ejecuta logout()
//       En Pestaña 2 = escucha LOGOUT y se desloguea automáticamente
```

---

## 4. Monitor Component (para desarrollo)

```typescript
// src/components/AuthMonitor.tsx (agregar solo en desarrollo)
import { useEffect, useState } from 'react';
import { authBroadcaster } from '@/lib/authBroadcast';

export function AuthMonitor() {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        authBroadcaster.onMessage((msg) => {
            const timestamp = new Date().toLocaleTimeString();
            setMessages(prev => [
                `[${timestamp}] ${msg.type}`,
                ...prev.slice(0, 9)
            ]);
        });
    }, []);

    return (
        <div style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            background: '#333',
            color: '#0f0',
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '10px',
            maxHeight: '200px',
            overflow: 'auto',
            borderRadius: '4px',
            zIndex: 9999
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                🔍 Auth Events
            </div>
            {messages.map((msg, i) => (
                <div key={i}>{msg}</div>
            ))}
        </div>
    );
}

// Usar en App.tsx:
// import { AuthMonitor } from '@/components/AuthMonitor';
// function App() {
//   return (
//     <div>
//       <Router {...props} />
//       {process.env.NODE_ENV === 'development' && <AuthMonitor />}
//     </div>
//   );
// }
```

---

## 5. Protected Route Component

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Verificando autenticación...</div>;
    }

    // Si la sesión se revoca en otra pestaña, BroadcastChannel
    // avisar a este componente → isAuthenticated = false → redirige a login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// Uso en router:
// <ProtectedRoute>
//     <Dashboard />
// </ProtectedRoute>
```

---

## 6. Sessions Panel (mostrar dispositivos activos)

```typescript
// src/components/Sessions.tsx
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export function Sessions() {
    const { getSessions, logoutDevice } = useAuth();
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const loadSessions = async () => {
            const data = await getSessions();
            setSessions(data);
        };
        loadSessions();
    }, [getSessions]);

    const handleLogoutDevice = async (deviceId: string) => {
        await logoutDevice(deviceId);
        // Si era el dispositivo actual:
        // - Esta pestaña se desloguea
        // - Otras pestañas también se desloguean (via BroadcastChannel)
        setSessions(sessions.filter(s => s.device_id !== deviceId));
    };

    return (
        <div>
            <h3>Sesiones Activas</h3>
            {sessions.map(session => (
                <div key={session.id} style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px'
                }}>
                    <p><strong>{session.device_type || 'Dispositivo'}</strong></p>
                    <p>Navegador: {session.browser}</p>
                    <p>OS: {session.os}</p>
                    <p>Última actividad: {new Date(session.last_used_at).toLocaleString()}</p>
                    <button
                        onClick={() => handleLogoutDevice(session.device_id)}
                        className="btn btn-sm btn-danger"
                    >
                        Logout
                    </button>
                </div>
            ))}
        </div>
    );
}
```

---

## 7. Testing Con Jest

```typescript
// src/context/AuthContext.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { authBroadcaster } from '@/lib/authBroadcast';

// Mock BroadcastChannel
jest.mock('@/lib/authBroadcast');

describe('AuthContext with BroadcastChannel', () => {
    it('should sync token across tabs', async () => {
        const TestComponent = () => {
            const { accessToken } = useAuth();
            return <div>{accessToken}</div>;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Simular que otra pestaña refresca el token
        const mockBroadcaster = authBroadcaster as jest.Mocked<typeof authBroadcaster>;
        const callback = mockBroadcaster.onMessage.mock.calls[0][0];

        callback({
            type: 'TOKEN_REFRESHED',
            token: 'new-token-123',
            timestamp: Date.now()
        });

        await waitFor(() => {
            expect(screen.getByText('new-token-123')).toBeInTheDocument();
        });
    });

    it('should logout when another tab sends LOGOUT', async () => {
        const TestComponent = () => {
            const { isAuthenticated } = useAuth();
            return <div>{isAuthenticated ? 'Logged in' : 'Logged out'}</div>;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const mockBroadcaster = authBroadcaster as jest.Mocked<typeof authBroadcaster>;
        const callback = mockBroadcaster.onMessage.mock.calls[0][0];

        callback({
            type: 'LOGOUT',
            timestamp: Date.now()
        });

        await waitFor(() => {
            expect(screen.getByText('Logged out')).toBeInTheDocument();
        });
    });
});
```

---

## 🎯 Casos de Uso Reales

| Caso | Comportamiento |
|------|-----------------|
| Usuario en Pestaña 1 hace una petición → 401 | Pestaña 1 refresca → todos se sicronizan |
| Usuario en Pestaña 2 hace logout | Todas las pestañas (1, 2, 3, ...) ven logout |
| Admin revoca sesión desde backend | Próxima petición en cualquier pestaña lo detecta |
| Cambiar entre pestañas durante refresh | Token ya está actualizado, sin errores |
| Cerrar Pestaña 1 mid-refresh | Pestaña 2 espera timeout y reintenta |
