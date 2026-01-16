import { AlineacioData } from "@/types/entrenador"
import { useMutation } from "@tanstack/react-query"

export const useGuardarAlineacio = () => {
    return useMutation<AlineacioData, Error,>({

    })
}