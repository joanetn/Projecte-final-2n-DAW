import { useQuery } from '@tanstack/react-query';
import {
    getEstadistiquesAdminWeb,
    getUsuarisAdmin,
    getEquipsAdmin,
    getLliguesAdmin,
    getPartitsAdmin,
    getArbitresAdmin,
    getPartitsArbitre,
    getMembresEquip,
    getClassificacionsAdmin,
    type GetUsuarisParams,
    type GetEquipsParams,
    type GetPartitsParams,
} from '@/services/adminWeb.service';

export const ADMIN_WEB_KEYS = {
    estadistiques: ['adminWeb', 'estadistiques'] as const,
    usuaris: (params?: GetUsuarisParams) => ['adminWeb', 'usuaris', params] as const,
    equips: (params?: GetEquipsParams) => ['adminWeb', 'equips', params] as const,
    lligues: ['adminWeb', 'lligues'] as const,
    partits: (params?: GetPartitsParams) => ['adminWeb', 'partits', params] as const,
    arbitres: ['adminWeb', 'arbitres'] as const,
    partitsArbitre: (arbitreId: string) => ['adminWeb', 'arbitres', arbitreId, 'partits'] as const,
    membresEquip: (equipId: string) => ['adminWeb', 'equips', equipId, 'membres'] as const,
    classificacions: ['adminWeb', 'classificacions'] as const,
};

export const useGetEstadistiques = () =>
    useQuery({
        queryKey: ADMIN_WEB_KEYS.estadistiques,
        queryFn: getEstadistiquesAdminWeb,
    });

export const useGetUsuarisAdmin = (params?: GetUsuarisParams) =>
    useQuery({
        queryKey: ADMIN_WEB_KEYS.usuaris(params),
        queryFn: () => getUsuarisAdmin(params),
    });

export const useGetEquipsAdmin = (params?: GetEquipsParams) =>
    useQuery({
        queryKey: ADMIN_WEB_KEYS.equips(params),
        queryFn: () => getEquipsAdmin(params),
    });

export const useGetLliguesAdmin = () =>
    useQuery({
        queryKey: ADMIN_WEB_KEYS.lligues,
        queryFn: getLliguesAdmin,
    });

export const useGetPartitsAdmin = (params?: GetPartitsParams) =>
    useQuery({
        queryKey: ADMIN_WEB_KEYS.partits(params),
        queryFn: () => getPartitsAdmin(params),
    });

export const useGetArbitresAdmin = () =>
    useQuery({
        queryKey: ADMIN_WEB_KEYS.arbitres,
        queryFn: getArbitresAdmin,
    });

export const useGetPartitsArbitre = (arbitreId: string) =>
    useQuery({
        queryKey: ADMIN_WEB_KEYS.partitsArbitre(arbitreId),
        queryFn: () => getPartitsArbitre(arbitreId),
        enabled: !!arbitreId,
    });

export const useGetMembresEquip = (equipId: string) =>
    useQuery({
        queryKey: ADMIN_WEB_KEYS.membresEquip(equipId),
        queryFn: () => getMembresEquip(equipId),
        enabled: !!equipId,
    });

export const useGetClassificacionsAdmin = () =>
    useQuery({
        queryKey: ADMIN_WEB_KEYS.classificacions,
        queryFn: getClassificacionsAdmin,
    });
