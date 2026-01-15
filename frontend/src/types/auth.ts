export interface Rol {
    id: number;
    rol: string;
}

export interface User {
    id: number;
    nom: string;
    email: string;
    rols: Rol[];
}

export interface RegisterData {
    nom: string;
    email: string;
    contrasenya: string;
    rol?: string[];
}

export interface RegisterResponse {
    id: number;
    nom: string;
    email: string;
    rols: { id: number; rol: string }[];
}

export interface LoginData {
    email: string;
    contrasenya: string;
}

export interface LoginResponse {
    usuari: User;
}