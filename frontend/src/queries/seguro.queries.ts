import { useQuery } from "@tanstack/react-query";
import { getEstatSeguro, getHistorialSeguros, validarSeguroJugador, validarJugadorsPerAlineacio } from "@/services/seguro.service";
import { EstatSeguroResponse, HistorialSegurosResponse, ValidarJugadorResponse, ValidarJugadorsAlineacioResponse } from "@/types/seguro";
export const useEstatSeguro = () =>
    useQuery<EstatSeguroResponse>({
        queryKey: ["estatSeguro"],
        queryFn: getEstatSeguro
    });
export const useHistorialSeguros = () =>
    useQuery<HistorialSegurosResponse>({
        queryKey: ["historialSeguros"],
        queryFn: getHistorialSeguros,
    });
export const useValidarSeguroJugador = (jugadorId: string) =>
    useQuery<ValidarJugadorResponse>({
        queryKey: ["validarSeguro", jugadorId],
        queryFn: () => validarSeguroJugador(jugadorId),
        enabled: !!jugadorId,
    });
export const useValidarJugadorsAlineacio = (jugadorIds: string[]) =>
    useQuery<ValidarJugadorsAlineacioResponse>({
        queryKey: ["validarJugadorsAlineacio", jugadorIds],
        queryFn: () => validarJugadorsPerAlineacio(jugadorIds),
        enabled: jugadorIds.length > 0
    });
