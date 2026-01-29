import { useQuery } from "@tanstack/react-query";
import {
    getEstadistiquesAdminWeb,
    getUsuarisAdmin,
    getEquipsAdmin,
    getLliguesAdmin,
    getPartitsAdmin,
    getArbitresAdmin,
    getMembresEquip,
    getPartitsArbitre,
    getClassificacions
} from "@/services/adminWeb.service";
export const useEstadistiquesAdminWeb = () => {
    return useQuery({
        queryKey: ["admin-web", "estadistiques"],
        queryFn: getEstadistiquesAdminWeb,
        staleTime: 1000 * 60 * 5,
    });
};
export const useUsuarisAdmin = (params?: { rol?: string; actiu?: string; cerca?: string }) => {
    return useQuery({
        queryKey: ["admin-web", "usuaris", params],
        queryFn: () => getUsuarisAdmin(params),
    });
};
export const useEquipsAdmin = (params?: { lligaId?: string; actiu?: string; cerca?: string }) => {
    return useQuery({
        queryKey: ["admin-web", "equips", params],
        queryFn: () => getEquipsAdmin(params),
    });
};
export const useMembresEquip = (equipId: string) => {
    return useQuery({
        queryKey: ["admin-web", "equips", equipId, "membres"],
        queryFn: () => getMembresEquip(equipId),
        enabled: !!equipId,
    });
};
export const useLliguesAdmin = () => {
    return useQuery({
        queryKey: ["admin-web", "lligues"],
        queryFn: getLliguesAdmin,
    });
};
export const usePartitsAdmin = (params?: { status?: string; cerca?: string }) => {
    return useQuery({
        queryKey: ["admin-web", "partits", params],
        queryFn: () => getPartitsAdmin(params),
    });
};
export const useArbitresAdmin = () => {
    return useQuery({
        queryKey: ["admin-web", "arbitres"],
        queryFn: getArbitresAdmin,
    });
};
export const usePartitsArbitre = (arbitreId: string) => {
    return useQuery({
        queryKey: ["admin-web", "arbitres", arbitreId, "partits"],
        queryFn: () => getPartitsArbitre(arbitreId),
        enabled: !!arbitreId,
    });
};
export const useClassificacions = () => {
    return useQuery({
        queryKey: ["admin-web", "classificacions"],
        queryFn: getClassificacions,
        staleTime: 1000 * 60 * 5,
    });
};