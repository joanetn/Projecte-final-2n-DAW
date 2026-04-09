import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPartits,
    getPartit,
    crearPartit,
    updatePartit,
    deletePartit,
    assignArbitre,
} from '@/services/partit.service';
import type { CreatePartitData } from '@/types/partit';

export const PARTIT_KEYS = {
    all: ['partits'] as const,
    filtered: (params?: { arbitreId?: string; equipId?: string; equipIds?: string; status?: string }) => ['partits', 'filtered', params ?? {}] as const,
    detail: (id: string) => ['partits', id] as const,
};

export const useGetPartits = (params?: { arbitreId?: string; equipId?: string; equipIds?: string; status?: string }) =>
    useQuery({
        queryKey: PARTIT_KEYS.filtered(params),
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
