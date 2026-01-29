export interface User {
    id: number;
    nom: string;
    email: string;
    telefon?: string;
    dataNaixement?: string;
    nivell?: string;
    avatar?: string;
    dni?: string;
    rols: string[];
    token?: string;
    created_at?: string;
    updated_at?: string;
}
export interface RegisterData {
    nom: string;
    email: string;
    contrasenya: string;
    rol?: string[];
    telefon?: string;
    dataNaixement?: string;
    nivell?: string;
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
}
export interface CurrentData {
    usuari: User;
}
