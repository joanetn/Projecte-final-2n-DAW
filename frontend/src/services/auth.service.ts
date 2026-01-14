import { fastapi, laravel } from '../api/axios';
import { User } from '../types/auth';
import { RegisterResponse, RegisterData, LoginData, LoginResponse } from '../types/auth';

export const getUsuaris = async (): Promise<User[]> => {
    const res = await laravel.get<User[]>('/usuaris');
    return res.data;
}

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
    try {
        console.log("DATA DEL REGISTRE", data);
        const res = await laravel.post<RegisterResponse>("/auth/register", data);
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.message || "Error al registrar l'usuari";
        throw new Error(message);
    }
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    try {
        console.log(data);
        const res = await laravel.post<LoginResponse>("/auth/login", data);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}