import { getJugadorsDisponibles } from "@/services/invitacions.service";
import { JugadorsDisponiblesResponse } from "@/types/invitacions";
import { useQuery } from "@tanstack/react-query";

export const useJugadorsDisponibles = () =>
    useQuery<JugadorsDisponiblesResponse>({
        queryKey: ["jugadors-disponibles"],
        queryFn: getJugadorsDisponibles
    })