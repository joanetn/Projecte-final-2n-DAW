export interface Rol {
    id: number;
    rol: string;
}

export interface User {
    id: number;
    nom: string;
    email: string;
    rols: Rol[];
    token: string;
}

export interface RegisterData {
    nom: string;
    email: string;
    contrasenya: string;
    rol?: string[];
}

export interface RegisterResponse {
    usuari: User;
}

export interface LoginData {
    email: string;
    contrasenya: string;
}

export interface LoginResponse {
    usuari: User;
    token: string;
}