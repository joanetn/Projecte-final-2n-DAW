import { getEnviarAlineacio } from "@/services/entrenador.service"
import { AlineacioData, AlineacioResponse } from "@/types/entrenador"
import { useMutation } from "@tanstack/react-query"

export const useGuardarAlineacio = () => {
    return useMutation<AlineacioResponse, Error, AlineacioData>({
        mutationFn: (body: AlineacioData) => getEnviarAlineacio(body),
    });
}