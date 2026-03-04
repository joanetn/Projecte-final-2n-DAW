import type { User } from "@/types/users";

export type AuthBroadcastMessage =
    | { type: 'TOKEN_REFRESHED'; token: string; timestamp: number }
    | { type: 'LOGIN'; token: string; user: User | null; timestamp: number }
    | { type: 'TOKEN_REFRESH_FAILED'; timestamp: number }
    | { type: 'LOGOUT'; timestamp: number }
    | { type: 'LOGOUT_ALL'; timestamp: number };

class AuthBroadcaster {
    private channel: BroadcastChannel | null = null;
    private refreshInProgress = false;
    private _waitingForRefresh = false;

    constructor() {
        if (typeof BroadcastChannel !== 'undefined') {
            this.channel = new BroadcastChannel('auth-channel');
            console.log(this._waitingForRefresh)
        }
    }

    onMessage(callback: (message: AuthBroadcastMessage) => void) {
        if (!this.channel) return;

        this.channel.addEventListener('message', (event) => {
            try {
                callback(event.data as AuthBroadcastMessage);
            } catch (error) {
                console.error('Error procesando mensaje de auth:', error);
            }
        });
    }

    requestRefresh(): boolean {
        if (this.refreshInProgress) {
            this._waitingForRefresh = true;
            return false;
        }

        this.refreshInProgress = true;
        return true;
    }

    broadcastTokenRefreshed(token: string) {
        if (!this.channel) return;

        this.channel.postMessage({
            type: 'TOKEN_REFRESHED',
            token,
            timestamp: Date.now(),
        } satisfies AuthBroadcastMessage);

        this.refreshInProgress = false;
    }

    broadcastRefreshFailed() {
        if (!this.channel) return;

        this.channel.postMessage({
            type: 'TOKEN_REFRESH_FAILED',
            timestamp: Date.now(),
        } satisfies AuthBroadcastMessage);

        this.refreshInProgress = false;
    }

    broadcastLogin(token: string, user: User | null) {
        if (!this.channel) return

        this.channel.postMessage({
            type: 'LOGIN',
            token,
            user,
            timestamp: Date.now()
        } satisfies AuthBroadcastMessage)
    }

    broadcastLogout() {
        if (!this.channel) return;

        this.channel.postMessage({
            type: 'LOGOUT',
            timestamp: Date.now(),
        } satisfies AuthBroadcastMessage);
    }

    broadcastLogoutAll() {
        if (!this.channel) return;

        this.channel.postMessage({
            type: 'LOGOUT_ALL',
            timestamp: Date.now(),
        } satisfies AuthBroadcastMessage);
    }

    close() {
        if (this.channel) {
            this.channel.close();
            this.channel = null;
        }
    }
}

export const authBroadcaster = new AuthBroadcaster();
