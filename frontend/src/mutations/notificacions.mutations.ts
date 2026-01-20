import { acceptProposta, rejectProposta } from "@/services/notificacions.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAcceptProposta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: acceptProposta,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificacions"] });
            queryClient.invalidateQueries({ queryKey: ["partitsPendents"] });
            queryClient.invalidateQueries({ queryKey: ["partitsJugats"] });
        }
    });
};

export const useRejectProposta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectProposta,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificacions"] });
        }
    });
};
