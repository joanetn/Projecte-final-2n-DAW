import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
    type ReactNode,
} from 'react';

// ─── Tipos del usuario (coincide con los campos de la tabla 'usuaris') ───
interface User {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    dataNaixement?: string;
    nivell?: string;
    avatar?: string;
    dni?: string;
    isActive: boolean;
}

// ─── Información de sesión activa (viene de GET /auth/sessions) ───
interface Session {
    id: string;
    device_id: string;
    device_type?: string;
    browser?: string;
    os?: string;
    last_used_at?: string;
    created_at?: string;
}

// ─── Todo lo que expone el contexto de autenticación ───
interface AuthContextType {
    // Estado
    user: User | null;
    accessToken: string | null;
    deviceId: string;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Acciones de autenticación
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    logoutAll: () => Promise<void>;
    logoutDevice: (deviceId: string) => Promise<void>;

    // Gestión de sesiones
    getSessions: () => Promise<Session[]>;

    // Utilidad para hacer peticiones autenticadas con auto-refresh
    apiCall: <T = unknown>(url: string, options?: RequestInit) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── URL base de la API ───
const API_URL = "http://localhost:8000/api" as string;

// ─── Genera o recupera un deviceId único por navegador ───
// Se guarda en localStorage para que persista entre sesiones
export const getOrCreateDeviceId = (): string => {
    const stored = localStorage.getItem('deviceId');
    if (stored) return stored;

    // Generar un ID único basado en timestamp + random
    const deviceId = `web-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('deviceId', deviceId);
    return deviceId;
};

// ─── Detectar información del navegador/dispositivo automáticamente ───
export const getDeviceInfo = () => {
    const ua = navigator.userAgent;

    // Detectar navegador
    let browser = 'Unknown';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg/')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';

    // Detectar SO
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    // Detectar tipo de dispositivo
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const deviceType = isMobile ? 'mobile' : 'desktop';

    return { browser, os, deviceType };
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(
        localStorage.getItem('accessToken'),
    );
    const [deviceId] = useState<string>(getOrCreateDeviceId);
    const [isLoading, setIsLoading] = useState(true);

    // Ref para evitar múltiples refreshes en paralelo (race condition)
    // Si ya hay un refresh en curso, reutilizamos su promesa
    const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

    // ─── REFRESH ACCESS TOKEN ───
    // Llama a POST /auth/refresh que lee la cookie httpOnly refresh_token
    // El backend devuelve un nuevo access token + rota la cookie refresh_token
    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
        // Si ya hay un refresh en curso, reutilizar su promesa
        // Esto evita que 5 peticiones fallidas lancen 5 refreshes simultáneos
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        const promise = (async () => {
            try {
                const response = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include', // Envía la cookie httpOnly refresh_token
                });

                if (response.ok) {
                    const data = await response.json();
                    const newToken = data.access_token;
                    localStorage.setItem('accessToken', newToken);
                    setAccessToken(newToken);
                    return newToken;
                }

                // Si el refresh falla (token expirado, sesión revocada, etc.)
                // Limpiar todo → el usuario necesita hacer login de nuevo
                localStorage.removeItem('accessToken');
                setAccessToken(null);
                setUser(null);
                return null;
            } catch (error) {
                console.error('Error refreshing access token:', error);
                localStorage.removeItem('accessToken');
                setAccessToken(null);
                setUser(null);
                return null;
            } finally {
                // Limpiar la ref para permitir futuros refreshes
                refreshPromiseRef.current = null;
            }
        })();

        refreshPromiseRef.current = promise;
        return promise;
    }, []);

    // ─── API CALL CON AUTO-REFRESH ───
    // Wrapper para hacer peticiones autenticadas que automáticamente:
    // 1. Añade el header Authorization: Bearer <accessToken>
    // 2. Si recibe 401 (TOKEN_EXPIRED), intenta un refresh y reintenta la petición
    // 3. Si el refresh también falla, cierra sesión
    const apiCall = useCallback(
        async <T = unknown>(url: string, options: RequestInit = {}): Promise<T> => {
            const currentToken = accessToken ?? localStorage.getItem('accessToken');

            // Primera petición con el token actual
            const doFetch = async (token: string | null) => {
                const headers = new Headers(options.headers);
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                // Solo añadir Content-Type si no es FormData (FormData lo pone solo)
                if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
                    headers.set('Content-Type', 'application/json');
                }

                return fetch(url.startsWith('http') ? url : `${API_URL}${url}`, {
                    ...options,
                    headers,
                    credentials: 'include', // Siempre enviar cookies
                });
            };

            let response = await doFetch(currentToken);

            // Si el access token ha expirado, intentar refresh + reintentar
            if (response.status === 401) {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    // Reintentar la petición original con el nuevo token
                    response = await doFetch(newToken);
                } else {
                    // El refresh falló → sesión cerrada
                    throw new Error('Sesión expirada. Inicia sesión de nuevo.');
                }
            }

            // Si sigue siendo error después del retry, lanzar
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error || errorData.message || `Error ${response.status}`,
                );
            }

            return response.json() as Promise<T>;
        },
        [accessToken, refreshAccessToken],
    );

    // ─── RECUPERAR SESIÓN AL CARGAR LA APP ───
    // Si hay un accessToken en localStorage, intenta obtener los datos del usuario
    // Si falla con 401, intenta refresh. Si el refresh también falla, limpia todo.
    const recoverSession = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('accessToken');

            if (!token) {
                // No hay token → intentar refresh (puede haber cookie válida)
                const newToken = await refreshAccessToken();
                if (!newToken) {
                    setIsLoading(false);
                    return;
                }
            }

            // Obtener datos del usuario con apiCall (que maneja auto-refresh)
            const data = await apiCall<{ user: User }>('/auth/me');
            setUser(data.user);
        } catch {
            // Si falla todo, asegurar estado limpio
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [apiCall, refreshAccessToken]);

    // ─── LOGIN ───
    // Envía email + password + deviceId al backend
    // El backend devuelve access_token (en body) + refresh_token (en cookie httpOnly)
    const login = useCallback(
        async (email: string, password: string): Promise<void> => {
            const { browser, os, deviceType } = getDeviceInfo();

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    deviceId,
                    deviceType,
                    browser,
                    os,
                }),
                credentials: 'include', // Para que guarde la cookie refresh_token
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al iniciar sesión');
            }

            const data = await response.json();

            // Guardar access token en localStorage y state
            localStorage.setItem('accessToken', data.access_token);
            setAccessToken(data.access_token);

            // El usuario viene en la respuesta del login
            setUser(data.user);
        },
        [deviceId],
    );

    // ─── LOGOUT (dispositivo actual) ───
    // Revoca la sesión actual en el backend y limpia el estado local
    const logout = useCallback(async (): Promise<void> => {
        try {
            const token = accessToken ?? localStorage.getItem('accessToken');
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include', // Enviar cookie refresh_token para revocarla
            });
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Siempre limpiar estado local, incluso si la petición falla
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUser(null);
        }
    }, [accessToken]);

    // ─── LOGOUT ALL (todos los dispositivos) ───
    // Incrementa session_version en la BD → invalida todos los refresh tokens
    const logoutAll = useCallback(async (): Promise<void> => {
        try {
            await apiCall('/auth/logout-all', { method: 'POST' });
        } catch (error) {
            console.error('Error en logout-all:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUser(null);
        }
    }, [apiCall]);

    // ─── LOGOUT DEVICE (dispositivo específico) ───
    // Cierra la sesión de un dispositivo concreto (ej: desde la pantalla de sesiones)
    const logoutDevice = useCallback(
        async (targetDeviceId: string): Promise<void> => {
            await apiCall('/auth/logout-device', {
                method: 'POST',
                body: JSON.stringify({ deviceId: targetDeviceId }),
            });
        },
        [apiCall],
    );

    // ─── GET SESSIONS ───
    // Obtener lista de sesiones activas del usuario
    const getSessions = useCallback(async (): Promise<Session[]> => {
        const data = await apiCall<{ sessions: Session[] }>('/auth/sessions');
        return data.sessions;
    }, [apiCall]);

    // Ejecutar recoverSession solo al montar el componente
    useEffect(() => {
        recoverSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value: AuthContextType = {
        user,
        accessToken,
        deviceId,
        isLoading,
        isAuthenticated: !!accessToken && !!user,
        login,
        logout,
        logoutAll,
        logoutDevice,
        getSessions,
        apiCall,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 * Debe usarse dentro de <AuthProvider>
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de <AuthProvider>');
    }
    return context;
}
