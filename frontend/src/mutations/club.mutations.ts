import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearClub, inscriureLliga } from "@/services/club.service";

export const useCrearClub = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: crearClub,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
            queryClient.invalidateQueries({ queryKey: ["user-equips"] });
        },
    });
};

export const useInscriureLliga = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: inscriureLliga,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lligues-disponibles"] });
            queryClient.invalidateQueries({ queryKey: ["equip-lligues"] });
        },
    });
};
