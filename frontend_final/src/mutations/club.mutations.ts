import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearClub, actualitzarClub, eliminarClub, crearEquip, inscriureEquipALliga } from '@/services/club.service';
import { CLUB_KEYS } from '@/queries/club.queries';
import type { CreateClubData, UpdateClubData, CreateEquipData } from '@/types/club';

export const useCrearClub = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateClubData) => crearClub(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.all });
        },
    });
};

export const useActualitzarClub = (clubId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateClubData) => actualitzarClub(clubId, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.detail(clubId) });
        },
    });
};

export const useEliminarClub = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (clubId: string) => eliminarClub(clubId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.all });
        },
    });
};

export const useCrearEquip = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateEquipData) => crearEquip(data.clubId, data),
        onSuccess: (_result, variables) => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.equips(variables.clubId) });
            qc.invalidateQueries({ queryKey: CLUB_KEYS.meusEquips() });
        },
    });
};

export const useInscriureEquipALliga = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            clubId,
            equipId,
            lligaId,
        }: {
            clubId: string;
            equipId: string;
            lligaId: string;
        }) => inscriureEquipALliga(clubId, equipId, lligaId),
        onSuccess: (_result, variables) => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.equips(variables.clubId) });
            qc.invalidateQueries({ queryKey: CLUB_KEYS.meusEquips() });
            qc.invalidateQueries({ queryKey: CLUB_KEYS.lligaDetail(variables.lligaId) });
            qc.invalidateQueries({ queryKey: CLUB_KEYS.lligues() });
        },
    });
};
