import { laravel, backend_rapid } from '../api/axios';
import { User, RegisterResponse, RegisterData, LoginData, LoginResponse, TeEquipResponse } from '../types/auth';
import { clearCurrentUser, getCurrentUser, setCurrentUser } from '@/lib/utils';
export const getUsuaris = async (): Promise<User[]> => {
    const res = await laravel.get<User[]>('/usuaris');
    return res.data;
}
export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
    try {
        console.log("DATA DEL REGISTRE", data);
        const res = await backend_rapid.post<RegisterResponse>("/auth/register", data);
        console.log("Resposta del backend:", res.data);
        if (res.data.usuari?.token) {
            setCurrentUser(res.data.usuari);
        }
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.message || "Error al registrar l'usuari";
        console.error("Error en registerUser:", err);
        throw new Error(message);
    }
};
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    try {
        const res = await backend_rapid.post<LoginResponse>("/auth/login", data);
        if (res.data.usuari) {
            setCurrentUser(res.data.usuari);
            return res.data;
        }
        throw new Error("Resposta invàlida del servidor");
    } catch (err: any) {
        console.error("Error de login:", err);
        const message = err.response?.data?.message || err.message || "Error d'inici de sessió";
        throw new Error(message);
    }
}
export const getCurrentUserData = async (): Promise<User> => {
    try {
        const res = await backend_rapid.get<{ usuari: User }>("/auth/me");
        if (res.data.usuari) {
            setCurrentUser(res.data.usuari);
            return res.data.usuari;
        }
        throw new Error("Resposta invàlida del servidor");
    } catch (err: any) {
        console.error("Error obtenint usuari actual:", err);
        const message = err.response?.data?.message || "Error obtenint dades de l'usuari";
        throw new Error(message);
    }
}

export const getTeEquip = async (): Promise<TeEquipResponse> => {
    try {
        const res = await backend_rapid.get<TeEquipResponse>("/auth/teEquip");
        return res.data;
    } catch (err: any) {
        console.error("Error obtenint si l'usuari te equip:", err);
        const message = err.response?.data?.message || "Error obtenint dades de l'usuari";
        throw new Error(message);
    }
}

export const useCurrentUser = () => {
    const user = getCurrentUser();
    return user;
}

export const logoutUser = () => {
    clearCurrentUser();
}
