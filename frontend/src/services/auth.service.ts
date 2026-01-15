import { fastapi, laravel, backend_rapid } from '../api/axios';
import { User } from '../types/auth';
import { clearCurrentUser, getCurrentUser, setCurrentUser } from '@/lib/utils';
import { RegisterResponse, RegisterData, LoginData, LoginResponse } from '../types/auth';
import { useAuth } from '@/context/AuthContext';

export const getUsuaris = async (): Promise<User[]> => {
    const res = await laravel.get<User[]>('/usuaris');
    return res.data;
}

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
    try {
        console.log("DATA DEL REGISTRE", data);
        const res = await backend_rapid.post<RegisterResponse>("/auth/register", data);
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.message || "Error al registrar l'usuari";
        throw new Error(message);
    }
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    try {
        const res = await backend_rapid.post<LoginResponse>("/auth/login", data);
        const userData = res.data.usuari || res.data;
        setCurrentUser(userData);
        return res.data;
    } catch (err: any) {
        console.error("Error de login:", err);
        throw new Error(err.response?.data?.message || err.message || "Error de inicio de sesión");
    }
}

export const useCurrentUser = () => {
    const user = getCurrentUser();
    return user;
}

export const logoutUser = () => {
    clearCurrentUser();
}