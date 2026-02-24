import { login, register } from "@/services/auth.service"
import type { LoginRequest, RegisterRequest } from "@/types/auth"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {
    // const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: LoginRequest) => login(data),
        // onSuccess: () => {
        //     queryClient.invalidateQueries({queryKey: ['']})
        // }
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterRequest) => register(data)
    })
}