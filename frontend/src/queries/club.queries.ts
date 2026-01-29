import { useQuery } from "@tanstack/react-query";
import { getLliguesDisponibles } from "@/services/club.service";

export const useLliguesDisponibles = () => {
    return useQuery({
        queryKey: ["lligues-disponibles"],
        queryFn: getLliguesDisponibles,
    });
};
