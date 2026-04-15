import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { authHeader } from '@/services/shared/auth-header';

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

let echoInstance: Echo<'pusher'> | null = null;

const resolveAuthHeaders = (): Record<string, string> => {
    const header = authHeader();
    const authorization = header.Authorization;

    if (typeof authorization === 'string' && authorization.trim() !== '') {
        return { Authorization: authorization };
    }

    return {};
};

const resolveLaravelBaseUrl = (): string => {
    const fromEnv = String(import.meta.env.VITE_LARAVEL_URL ?? '').trim();
    return fromEnv !== '' ? fromEnv : 'http://localhost:8000';
};

const resolvePusherKey = (): string => String(import.meta.env.VITE_PUSHER_APP_KEY ?? '').trim();

const resolvePusherScheme = (): 'http' | 'https' => {
    const fromEnv = String(import.meta.env.VITE_PUSHER_SCHEME ?? '').trim().toLowerCase();
    return fromEnv === 'https' ? 'https' : 'http';
};

export const isNotificationsRealtimeEnabled = (): boolean => resolvePusherKey() !== '';

export const getNotificationsEcho = (): Echo<'pusher'> | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const key = resolvePusherKey();
    if (key === '') {
        return null;
    }

    if (echoInstance) {
        return echoInstance;
    }

    window.Pusher = Pusher;

    const laravelBaseUrl = resolveLaravelBaseUrl().replace(/\/$/, '');
    const parsedUrl = new URL(laravelBaseUrl);
    const scheme = resolvePusherScheme();
    const configuredPort = Number(import.meta.env.VITE_PUSHER_PORT ?? '');
    const port = Number.isFinite(configuredPort) && configuredPort > 0
        ? configuredPort
        : (scheme === 'https' ? 443 : 6001);
    const host = String(import.meta.env.VITE_PUSHER_HOST ?? '').trim() || parsedUrl.hostname;

    echoInstance = new Echo({
        broadcaster: 'pusher',
        key,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === 'https',
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${laravelBaseUrl}/api/notifications/broadcasting/auth`,
        auth: {
            headers: resolveAuthHeaders(),
        },
    });

    return echoInstance;
};

export const refreshNotificationsEchoAuth = (): void => {
    if (!echoInstance) {
        return;
    }

    const connector = echoInstance.connector as {
        options?: {
            auth?: {
                headers?: Record<string, string>;
            };
        };
    };

    if (!connector.options) {
        connector.options = {};
    }

    connector.options.auth = {
        ...(connector.options.auth ?? {}),
        headers: resolveAuthHeaders(),
    };
};
