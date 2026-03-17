import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    toggleUsuariActiu,
    canviarRolsUsuari,
    eliminarUsuari,
    crearEquip,
    actualitzarEquip,
    eliminarEquip,
    crearLliga,
    actualitzarLliga,
    eliminarLliga,
    crearPartit,
    actualitzarPartit,
    eliminarPartit,
    assignarArbitre,
    type GetUsuarisParams,
    type GetEquipsParams,
    type GetPartitsParams,
} from '@/services/adminWeb.service';
import type {
    CreateEquipData,
    UpdateEquipData,
    CreateLligaData,
    UpdateLligaData,
    CreatePartitData,
    UpdatePartitData,
} from '@/types/admin';
import { ADMIN_WEB_KEYS } from '@/queries/adminWeb.queries';

// ─── Usuaris ─────────────────────────────────────────────────────────────────

export const useToggleUsuariActiu = (usuarisParams?: GetUsuarisParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (usuariId: string) => toggleUsuariActiu(usuariId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.usuaris(usuarisParams) }),
    });
};

export const useCanviarRolsUsuari = (usuarisParams?: GetUsuarisParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ usuariId, rols }: { usuariId: string; rols: string[] }) =>
            canviarRolsUsuari(usuariId, rols),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.usuaris(usuarisParams) }),
    });
};

export const useEliminarUsuari = (usuarisParams?: GetUsuarisParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (usuariId: string) => eliminarUsuari(usuariId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.usuaris(usuarisParams) }),
    });
};

// ─── Equips ───────────────────────────────────────────────────────────────────

export const useCrearEquip = (equipsParams?: GetEquipsParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateEquipData) => crearEquip(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.equips(equipsParams) }),
    });
};

export const useActualitzarEquip = (equipsParams?: GetEquipsParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ equipId, data }: { equipId: string; data: UpdateEquipData }) =>
            actualitzarEquip(equipId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.equips(equipsParams) }),
    });
};

export const useEliminarEquip = (equipsParams?: GetEquipsParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (equipId: string) => eliminarEquip(equipId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.equips(equipsParams) }),
    });
};

// ─── Lligues ─────────────────────────────────────────────────────────────────

export const useCrearLliga = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateLligaData) => crearLliga(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.lligues }),
    });
};

export const useActualitzarLliga = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ lligaId, data }: { lligaId: string; data: UpdateLligaData }) =>
            actualitzarLliga(lligaId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.lligues }),
    });
};

export const useEliminarLliga = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (lligaId: string) => eliminarLliga(lligaId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.lligues }),
    });
};

// ─── Partits ─────────────────────────────────────────────────────────────────

export const useCrearPartit = (partitsParams?: GetPartitsParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePartitData) => crearPartit(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.partits(partitsParams) }),
    });
};

export const useActualitzarPartit = (partitsParams?: GetPartitsParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ partitId, data }: { partitId: string; data: UpdatePartitData }) =>
            actualitzarPartit(partitId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.partits(partitsParams) }),
    });
};

export const useEliminarPartit = (partitsParams?: GetPartitsParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (partitId: string) => eliminarPartit(partitId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.partits(partitsParams) }),
    });
};

// ─── Àrbitres ─────────────────────────────────────────────────────────────────

export const useAssignarArbitre = (partitsParams?: GetPartitsParams) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            partitId,
            arbitreId,
        }: {
            partitId: string;
            arbitreId: string | null;
        }) => assignarArbitre(partitId, arbitreId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.partits(partitsParams) });
            qc.invalidateQueries({ queryKey: ADMIN_WEB_KEYS.arbitres });
        },
    });
};
