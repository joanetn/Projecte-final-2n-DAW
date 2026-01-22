import { getCancelarInvitacio, getEnviarInvitacio } from "@/services/invitacions.service";
import { InvitacioData, InvitacioResponse } from "@/types/invitacions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEnviarInvitacio = () => {
    const queryClient = useQueryClient();
    return useMutation<InvitacioResponse, Error, InvitacioData>({
        mutationFn: (body: InvitacioData) => getEnviarInvitacio(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitacionsEnviades"] });
            queryClient.invalidateQueries({ queryKey: ["jugadors-disponibles"] });
        },
    });
}

export const useCancelarInvitacio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => getCancelarInvitacio(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitacionsEnviades"] });
            queryClient.invalidateQueries({ queryKey: ["jugadors-disponibles"] });
        }
    })
}