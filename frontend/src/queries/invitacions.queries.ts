import { getInvitacionsEnviades, getInvitacionsRebudes, getJugadorsDisponibles, getEntrenadorsDisponibles } from "@/services/invitacions.service";
import { InvitacionsEnviadesResponse, InvitacionsRebudesResponse, JugadorsDisponiblesResponse } from "@/types/invitacions";
import { useQuery } from "@tanstack/react-query";
export const useJugadorsDisponibles = () =>
    useQuery<JugadorsDisponiblesResponse>({
        queryKey: ["jugadors-disponibles"],
        queryFn: getJugadorsDisponibles
    })
export const useEntrenadorsDisponibles = () =>
    useQuery<{ total: number; entrenadors: any[] }>({
        queryKey: ["entrenadors-disponibles"],
        queryFn: getEntrenadorsDisponibles
    })
export const useInvitacionsEnviades = () =>
    useQuery<InvitacionsEnviadesResponse>({
        queryKey: ["invitacionsEnviades"],
        queryFn: getInvitacionsEnviades
    })
export const useInvitacionsRebudes = () =>
    useQuery<InvitacionsRebudesResponse>({
        queryKey: ["invitacionsRebudes"],
        queryFn: getInvitacionsRebudes
    })
