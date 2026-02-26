import { login, register } from "@/services/auth.service"
import type { LoginRequest, RegisterRequest } from "@/types/auth"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {

    return useMutation({
        mutationFn: (data: LoginRequest) => login(data),
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterRequest) => register(data)
    })
}