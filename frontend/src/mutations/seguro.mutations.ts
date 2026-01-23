import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    crearSessioPagament,
    confirmarPagament,
    confirmarPagamentSimulat
} from "@/services/seguro.service";
import { CrearSessioPagamentResponse, ConfirmarPagamentResponse } from "@/types/seguro";

export const useCrearSessioPagament = () => {
    return useMutation<CrearSessioPagamentResponse, Error>({
        mutationFn: crearSessioPagament,
    });
};

export const useConfirmarPagament = () => {
    const queryClient = useQueryClient();

    return useMutation<ConfirmarPagamentResponse, Error, string>({
        mutationFn: (sessionId: string) => confirmarPagament(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["estatSeguro"] });
            queryClient.invalidateQueries({ queryKey: ["historialSeguros"] });
        },
    });
};

export const useConfirmarPagamentSimulat = () => {
    const queryClient = useQueryClient();

    return useMutation<ConfirmarPagamentResponse, Error>({
        mutationFn: confirmarPagamentSimulat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["estatSeguro"] });
            queryClient.invalidateQueries({ queryKey: ["historialSeguros"] });
        },
    });
};
