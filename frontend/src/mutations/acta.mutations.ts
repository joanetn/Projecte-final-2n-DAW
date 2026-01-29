import { queryClient } from "@/lib/utils"
import { actualitzarActa, crearActa, eliminarActa, validarActa } from "@/services/acta.service"
import { ActaResponse, ActualitzarActaRequest, CrearActaRequest } from "@/types/acta"
import { useMutation } from "@tanstack/react-query"
export const useCrearActa = () => {
    return useMutation<ActaResponse, Error, CrearActaRequest>({
        mutationFn: (data: CrearActaRequest) => crearActa(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mevesActes"] });
            queryClient.invalidateQueries({ queryKey: ["partitsPendentsActa"] });
        }
    })
};
export const useActualitzarActa = () => {
    return useMutation<ActaResponse, Error, { id: string; data: ActualitzarActaRequest }>({
        mutationFn: ({ id, data }) => actualitzarActa(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mevesActes"] });
        }
    })
}
export const useValidarActa = () => {
    return useMutation<ActaResponse, Error, { id: string }>({
        mutationFn: ({ id }) => validarActa(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mevesActes"] });
            queryClient.invalidateQueries({ queryKey: ["partitsPendentsActa"] });
            // Invalidar classificacions quan es valida una acta
            queryClient.invalidateQueries({ queryKey: ["admin-web", "classificacions"] });
        }
    })
}
export const useEliminarActa = () => {
    return useMutation<{ success: boolean, missatge: string }, Error, { id: string }>({
        mutationFn: ({ id }) => eliminarActa(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mevesActes"] });
            queryClient.invalidateQueries({ queryKey: ["partitsPendentsActa"] });
        }
    })
}
