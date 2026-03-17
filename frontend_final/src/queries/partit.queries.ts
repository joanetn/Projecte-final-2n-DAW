import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPartits,
    getPartit,
    crearPartit,
    updatePartit,
    deletePartit,
    assignArbitre,
    type CreatePartitData,
} from '@/services/partit.service';

export const PARTIT_KEYS = {
    all: ['partits'] as const,
    byArbitre: (arbitreId: string) => ['partits', 'arbitre', arbitreId] as const,
    byEquip: (equipId: string) => ['partits', 'equip', equipId] as const,
    detail: (id: string) => ['partits', id] as const,
};

export const useGetPartits = (params?: { arbitreId?: string; equipId?: string; status?: string }) =>
    useQuery({
        queryKey: params?.arbitreId
            ? PARTIT_KEYS.byArbitre(params.arbitreId)
            : params?.equipId
                ? PARTIT_KEYS.byEquip(params.equipId)
                : PARTIT_KEYS.all,
        queryFn: () => getPartits(params),
    });

export const useGetPartit = (id: string | null) =>
    useQuery({
        queryKey: PARTIT_KEYS.detail(id ?? ''),
        queryFn: () => getPartit(id!),
        enabled: !!id,
    });

export const useCrearPartit = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePartitData) => crearPartit(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: PARTIT_KEYS.all }),
    });
};

export const useUpdatePartit = (id: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<CreatePartitData & { status: string }>) => updatePartit(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PARTIT_KEYS.all });
            qc.invalidateQueries({ queryKey: PARTIT_KEYS.detail(id) });
        },
    });
};

export const useDeletePartit = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deletePartit(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: PARTIT_KEYS.all }),
    });
};

export const useAssignArbitre = (partitId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (arbitreId: string) => assignArbitre(partitId, arbitreId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PARTIT_KEYS.all });
            qc.invalidateQueries({ queryKey: PARTIT_KEYS.detail(partitId) });
        },
    });
};
