import type { User } from "./users";

export interface LoginRequest {
    email: string;
    password: string;
    deviceId: string;
    deviceType?: string;
    browser?: string;
    os?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User
}

export interface RegisterRequest {
    nom: string;
    email: string;
    contrasenya: string;
    deviceId: string;
    telefon?: string | null;
    dataNaiximent?: string | null;
    avatar?: string | null;
    dni?: string | null;
    deviceType?: string | null;
    browser?: string | null;
    os?: string | null;
}