import { getInvitacionsEnviades, getInvitacionsRebudes, getJugadorsDisponibles } from "@/services/invitacions.service";
import { InvitacionsEnviadesResponse, InvitacionsRebudesResponse, JugadorsDisponiblesResponse } from "@/types/invitacions";
import { useQuery } from "@tanstack/react-query";

export const useJugadorsDisponibles = () =>
    useQuery<JugadorsDisponiblesResponse>({
        queryKey: ["jugadors-disponibles"],
        queryFn: getJugadorsDisponibles
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