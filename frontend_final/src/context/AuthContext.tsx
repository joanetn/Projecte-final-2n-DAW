import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
    type ReactNode,
} from 'react';
import { authBroadcaster, type AuthBroadcastMessage } from '../lib/authBroadcast';

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

interface Session {
    id: string;
    device_id: string;
    device_type?: string;
    browser?: string;
    os?: string;
    last_used_at?: string;
    created_at?: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    deviceId: string;
    isLoading: boolean;
    isAuthenticated: boolean;

    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    logoutAll: () => Promise<void>;
    logoutDevice: (deviceId: string) => Promise<void>;

    getSessions: () => Promise<Session[]>;

    apiCall: <T = unknown>(url: string, options?: RequestInit) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:8000/api" as string;

export const getOrCreateDeviceId = (): string => {
    const stored = localStorage.getItem('deviceId');
    if (stored) return stored;

    const deviceId = `web-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('deviceId', deviceId);
    return deviceId;
};

export const getDeviceInfo = () => {
    const ua = navigator.userAgent;

    let browser = 'Unknown';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg/')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';

    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

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

    const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

    const refreshWaitingRef = useRef<{
        promise: Promise<string | null>;
        resolve: (token: string | null) => void;
    } | null>(null);

    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        const shouldRefresh = authBroadcaster.requestRefresh();

        if (!shouldRefresh) {
            return new Promise((resolve) => {
                if (!refreshWaitingRef.current) {
                    refreshWaitingRef.current = {
                        promise: Promise.resolve(null),
                        resolve,
                    };
                }
                refreshWaitingRef.current!.resolve = resolve;
            });
        }

        const promise = (async () => {
            try {
                const response = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    const newToken = data.access_token;

                    localStorage.setItem('accessToken', newToken);
                    setAccessToken(newToken);

                    authBroadcaster.broadcastTokenRefreshed(newToken);

                    return newToken;
                }

                localStorage.removeItem('accessToken');
                setAccessToken(null);
                setUser(null);

                authBroadcaster.broadcastRefreshFailed();

                return null;
            } catch (error) {
                console.error('Error refreshing access token:', error);
                localStorage.removeItem('accessToken');
                setAccessToken(null);
                setUser(null);
                authBroadcaster.broadcastRefreshFailed();
                return null;
            } finally {
                refreshPromiseRef.current = null;
            }
        })();

        refreshPromiseRef.current = promise;
        return promise;
    }, []);

    const apiCall = useCallback(
        async <T = unknown>(url: string, options: RequestInit = {}): Promise<T> => {
            const currentToken = accessToken ?? localStorage.getItem('accessToken');

            const doFetch = async (token: string | null) => {
                const headers = new Headers(options.headers);
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
                    headers.set('Content-Type', 'application/json');
                }

                return fetch(url.startsWith('http') ? url : `${API_URL}${url}`, {
                    ...options,
                    headers,
                    credentials: 'include',
                });
            };

            let response = await doFetch(currentToken);

            if (response.status === 401) {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    response = await doFetch(newToken);
                } else {
                    throw new Error('Sesión expirada. Inicia sesión de nuevo.');
                }
            }

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

    const recoverSession = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('accessToken');

            if (!token) {
                const newToken = await refreshAccessToken();
                if (!newToken) {
                    setIsLoading(false);
                    return;
                }
            }

            const data = await apiCall<{ user: User }>('/auth/me');
            setUser(data.user);
        } catch {
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [apiCall, refreshAccessToken]);

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
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al iniciar sesión');
            }

            const data = await response.json();

            localStorage.setItem('accessToken', data.access_token);
            setAccessToken(data.access_token);

            setUser(data.user);

            authBroadcaster.broadcastLogin(data.access_token, user)
        },
        [deviceId],
    );

    const logout = useCallback(async (): Promise<void> => {
        try {
            const token = accessToken ?? localStorage.getItem('accessToken');
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deviceId }),
                credentials: 'include',
            });
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUser(null);

            authBroadcaster.broadcastLogout();
        }
    }, [accessToken, deviceId]);

    const logoutAll = useCallback(async (): Promise<void> => {
        try {
            await apiCall('/auth/logout-all', { method: 'POST' });
        } catch (error) {
            console.error('Error en logout-all:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUser(null);

            authBroadcaster.broadcastLogoutAll();
        }
    }, [apiCall]);

    const logoutDevice = useCallback(
        async (targetDeviceId: string): Promise<void> => {
            await apiCall('/auth/logout-device', {
                method: 'POST',
                body: JSON.stringify({ deviceId: targetDeviceId }),
            });

            if (targetDeviceId === deviceId) {
                localStorage.removeItem('accessToken');
                setAccessToken(null);
                setUser(null);
            }
        },
        [apiCall, deviceId],
    );

    const getSessions = useCallback(async (): Promise<Session[]> => {
        const data = await apiCall<{ sessions: Session[] }>('/auth/sessions');
        return data.sessions;
    }, [apiCall]);

    useEffect(() => {
        recoverSession();

        const handleBroadcastMessage = (message: AuthBroadcastMessage) => {
            switch (message.type) {
                case 'TOKEN_REFRESHED':
                    localStorage.setItem('accessToken', message.token);
                    setAccessToken(message.token);

                    if (refreshWaitingRef.current) {
                        refreshWaitingRef.current.resolve(message.token);
                        refreshWaitingRef.current = null;
                    }
                    break;

                case 'LOGIN':
                    localStorage.setItem('accessToken', message.token);
                    setAccessToken(message.token);
                    recoverSession()

                    if (refreshWaitingRef.current) {
                        refreshWaitingRef.current.resolve(message.token);
                        refreshWaitingRef.current = null;
                    }
                    break;

                case 'TOKEN_REFRESH_FAILED':
                    localStorage.removeItem('accessToken');
                    setAccessToken(null);
                    setUser(null);

                    if (refreshWaitingRef.current) {
                        refreshWaitingRef.current.resolve(null);
                        refreshWaitingRef.current = null;
                    }
                    break;

                case 'LOGOUT':
                    localStorage.removeItem('accessToken');
                    setAccessToken(null);
                    setUser(null);
                    break;

                case 'LOGOUT_ALL':
                    localStorage.removeItem('accessToken');
                    setAccessToken(null);
                    setUser(null);
                    break;
            }
        };

        authBroadcaster.onMessage(handleBroadcastMessage);
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

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de <AuthProvider>');
    }
    return context;
}
