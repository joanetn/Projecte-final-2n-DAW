import { useQuery } from '@tanstack/react-query';
import {
    getClubs,
    getClub,
    getEquipsClub,
    getMeusEquips,
    getEquipMembres,
    getLeagueCategories,
    getLliguesDisponibles,
    getLligaDetail,
} from '@/services/club.service';

export const CLUB_KEYS = {
    all: ['clubs'] as const,
    detail: (id: string) => ['clubs', id] as const,
    equips: (clubId: string) => ['clubs', clubId, 'equips'] as const,
    meusEquips: () => ['equips', 'me'] as const,
    categories: () => ['clubs', 'league-categories'] as const,
    lligues: () => ['lligues', 'all'] as const,
    lligaDetail: (lligaId: string) => ['lligues', lligaId, 'detail'] as const,
};

export const useGetClubs = () =>
    useQuery({
        queryKey: CLUB_KEYS.all,
        queryFn: getClubs,
    });

export const useGetClub = (clubId: string | null) =>
    useQuery({
        queryKey: CLUB_KEYS.detail(clubId ?? ''),
        queryFn: () => getClub(clubId!),
        enabled: !!clubId,
    });

export const useGetEquipsClub = (clubId: string | null) =>
    useQuery({
        queryKey: CLUB_KEYS.equips(clubId ?? ''),
        queryFn: () => getEquipsClub(clubId!),
        enabled: !!clubId,
    });

export const useGetMeusEquips = (usuariId: string | null) =>
    useQuery({
        queryKey: [...CLUB_KEYS.meusEquips(), usuariId],
        queryFn: () => getMeusEquips(usuariId!),
        enabled: !!usuariId,
    });

export const useGetEquipMembres = (equipId: string | null) =>
    useQuery({
        queryKey: ['equips', equipId, 'membres'],
        queryFn: () => getEquipMembres(equipId!),
        enabled: !!equipId,
    });

export const useGetLeagueCategories = () =>
    useQuery({
        queryKey: CLUB_KEYS.categories(),
        queryFn: getLeagueCategories,
        staleTime: 1000 * 60 * 30,
    });

export const useGetLliguesDisponibles = (categoria: string | null) =>
    useQuery({
        queryKey: [...CLUB_KEYS.lligues(), categoria ?? 'all'],
        queryFn: getLliguesDisponibles,
        select: (lligues) => {
            if (!categoria) {
                return lligues;
            }

            return lligues.filter(
                (lliga) =>
                    (lliga.categoria ?? '').toUpperCase() === categoria.toUpperCase(),
            );
        },
    });

export const useGetLligaDetail = (lligaId: string | null) =>
    useQuery({
        queryKey: CLUB_KEYS.lligaDetail(lligaId ?? ''),
        queryFn: () => getLligaDetail(lligaId!),
        enabled: !!lligaId,
    });
