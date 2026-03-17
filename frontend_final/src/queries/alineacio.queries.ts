import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAlineacioByPartit,
    crearAlineacio,
    updateAlineacio,
    deleteAlineacio,
    type Alineacio,
} from '@/services/alineacio.service';
import {
    getInvitacionsPerUsuari,
    getInvitacionsPendents,
    respondreInvitacio,
} from '@/services/invitacio.service';

// ─── Alineacio ────────────────────────────────────────────────────────────────

export const ALINEACIO_KEYS = {
    byPartit: (partitId: string) => ['alineacions', 'partit', partitId] as const,
};

export const useGetAlineacioByPartit = (partitId: string | null) =>
    useQuery({
        queryKey: ALINEACIO_KEYS.byPartit(partitId ?? ''),
        queryFn: () => getAlineacioByPartit(partitId!),
        enabled: !!partitId,
    });

export const useCrearAlineacio = (partitId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Alineacio) => crearAlineacio(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ALINEACIO_KEYS.byPartit(partitId) }),
    });
};

export const useUpdateAlineacio = (id: string, partitId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Alineacio>) => updateAlineacio(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ALINEACIO_KEYS.byPartit(partitId) }),
    });
};

export const useDeleteAlineacio = (partitId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAlineacio(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ALINEACIO_KEYS.byPartit(partitId) }),
    });
};

// ─── Invitacio ────────────────────────────────────────────────────────────────

export const INVITACIO_KEYS = {
    perUsuari: (usuariId: string) => ['invitacions', 'usuari', usuariId] as const,
    pendents: (usuariId: string) => ['invitacions', 'usuari', usuariId, 'pendents'] as const,
};

export const useGetInvitacionsUsuari = (usuariId: string | null) =>
    useQuery({
        queryKey: INVITACIO_KEYS.perUsuari(usuariId ?? ''),
        queryFn: () => getInvitacionsPerUsuari(usuariId!),
        enabled: !!usuariId,
    });

export const useGetInvitacionsPendents = (usuariId: string | null) =>
    useQuery({
        queryKey: INVITACIO_KEYS.pendents(usuariId ?? ''),
        queryFn: () => getInvitacionsPendents(usuariId!),
        enabled: !!usuariId,
    });

export const useRespondreInvitacio = (usuariId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'ACCEPTADA' | 'REBUTJADA' }) =>
            respondreInvitacio(id, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: INVITACIO_KEYS.perUsuari(usuariId) });
            qc.invalidateQueries({ queryKey: INVITACIO_KEYS.pendents(usuariId) });
        },
    });
};
