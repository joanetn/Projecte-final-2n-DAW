import { getAcceptarInvitacio, getCancelarInvitacio, getEnviarInvitacio, getRebujarInvitacio } from "@/services/invitacions.service";
import { InvitacioData, InvitacioResponse } from "@/types/invitacions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useEnviarInvitacio = () => {
    const queryClient = useQueryClient();
    return useMutation<InvitacioResponse, Error, InvitacioData>({
        mutationFn: (body: InvitacioData) => getEnviarInvitacio(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitacionsEnviades"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["jugadors-disponibles"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["invitacionsRebudes"], refetchType: 'all' });
        },
    });
}
export const useCancelarInvitacio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => getCancelarInvitacio(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitacionsEnviades"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["jugadors-disponibles"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["invitacionsRebudes"], refetchType: 'all' });
        }
    })
}
export const useAcceptarInvitacio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => getAcceptarInvitacio(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitacionsRebudes"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["invitacionsEnviades"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["jugadors-disponibles"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["plantilla"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["plantillaAdminEquip"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["admin-equip"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["entrenador"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["user"], refetchType: 'all' });
        }
    })
}
export const useRebutjarInvitacio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => getRebujarInvitacio(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitacionsRebudes"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["invitacionsEnviades"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["jugadors-disponibles"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["plantilla"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["plantillaAdminEquip"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["admin-equip"], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ["entrenador"], refetchType: 'all' });
        }
    })
}
