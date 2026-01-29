import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../services/auth.service";
import { RegisterData, RegisterResponse, LoginData, LoginResponse } from "../types/auth";
export const useRegister = () => {
    return useMutation<RegisterResponse, Error, RegisterData>({
        mutationFn: (data: RegisterData) => registerUser(data),
    });
};
export const useLogin = () => {
    return useMutation<LoginResponse, Error, LoginData>({
        mutationFn: (data: LoginData) => loginUser(data),
    });
}
