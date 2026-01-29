import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    assignarArbitre
} from "@/services/adminWeb.service";

// ═══════════════════════════════════════════════════════════════
// USUARIS
// ═══════════════════════════════════════════════════════════════

export const useToggleUsuariActiu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (usuariId: string) => toggleUsuariActiu(usuariId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "usuaris"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web", "estadistiques"] });
        },
    });
};

export const useCanviarRolsUsuari = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ usuariId, rols }: { usuariId: string; rols: string[] }) =>
            canviarRolsUsuari(usuariId, rols),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "usuaris"] });
        },
    });
};

export const useEliminarUsuari = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (usuariId: string) => eliminarUsuari(usuariId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "usuaris"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web", "estadistiques"] });
        },
    });
};

// ═══════════════════════════════════════════════════════════════
// EQUIPS
// ═══════════════════════════════════════════════════════════════

export const useCrearEquip = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { nom: string; categoria?: string; lligaId?: string }) =>
            crearEquip(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "equips"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web", "estadistiques"] });
        },
    });
};

export const useActualitzarEquip = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            equipId,
            data
        }: {
            equipId: string;
            data: { nom?: string; categoria?: string; lligaId?: string; isActive?: boolean };
        }) => actualitzarEquip(equipId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "equips"] });
        },
    });
};

export const useEliminarEquip = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (equipId: string) => eliminarEquip(equipId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "equips"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web", "estadistiques"] });
        },
    });
};

// ═══════════════════════════════════════════════════════════════
// LLIGUES
// ═══════════════════════════════════════════════════════════════

export const useCrearLliga = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { nom: string; categoria?: string }) => crearLliga(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "lligues"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web", "estadistiques"] });
        },
    });
};

export const useActualitzarLliga = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            lligaId,
            data
        }: {
            lligaId: string;
            data: { nom?: string; categoria?: string; isActive?: boolean };
        }) => actualitzarLliga(lligaId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "lligues"] });
        },
    });
};

export const useEliminarLliga = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (lligaId: string) => eliminarLliga(lligaId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "lligues"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web", "estadistiques"] });
        },
    });
};

// ═══════════════════════════════════════════════════════════════
// PARTITS
// ═══════════════════════════════════════════════════════════════

export const useCrearPartit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            localId: string;
            visitantId: string;
            data: string;
            hora?: string;
            ubicacio?: string;
            lligaId?: string;
        }) => crearPartit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "partits"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web", "estadistiques"] });
        },
    });
};

export const useActualitzarPartit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            partitId,
            data
        }: {
            partitId: string;
            data: {
                data?: string;
                hora?: string;
                ubicacio?: string;
                status?: string;
                setsLocal?: number;
                setsVisitant?: number;
                arbitreId?: string;
            };
        }) => actualitzarPartit(partitId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "partits"] });
        },
    });
};

export const useEliminarPartit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (partitId: string) => eliminarPartit(partitId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "partits"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web", "estadistiques"] });
        },
    });
};

// ═══════════════════════════════════════════════════════════════
// ÀRBITRES
// ═══════════════════════════════════════════════════════════════

export const useAssignarArbitre = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ partitId, arbitreId }: { partitId: string; arbitreId: string | null }) =>
            assignarArbitre(partitId, arbitreId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-web", "partits"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web", "arbitres"] });
        },
    });
};
