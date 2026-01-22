import { getInvitacionsEnviades, getJugadorsDisponibles } from "@/services/invitacions.service";
import { InvitacionsEnviadesResponse, JugadorsDisponiblesResponse } from "@/types/invitacions";
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