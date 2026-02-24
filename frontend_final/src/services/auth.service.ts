import { laravel } from "@/api/axios";
import type { LoginRequest, AuthResponse, RegisterRequest } from "@/types/auth";

export const login = async (data: LoginRequest) => {
    const res = await laravel.post<AuthResponse>(`/api/auth/login`, data)
    return res.data
}

export const register = async (data: RegisterRequest) => {
    const res = await laravel.post<AuthResponse>(`/api/auth/register`, data)
    return res.data
}