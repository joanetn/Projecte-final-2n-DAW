import { useQuery } from '@tanstack/react-query';
import { getClubs, getClub, getEquipsClub, getMeusEquips, getEquipMembres } from '@/services/club.service';

export const CLUB_KEYS = {
    all: ['clubs'] as const,
    detail: (id: string) => ['clubs', id] as const,
    equips: (clubId: string) => ['clubs', clubId, 'equips'] as const,
    meusEquips: () => ['equips', 'me'] as const,
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
