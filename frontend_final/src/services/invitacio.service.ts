import { laravel } from '@/api/axios';
import type {
    CreateInvitacioData,
    Invitacio,
    InvitacioCandidate,
} from '@/services/dto/invitacio.dto';
import {
    normalizeInvitacioCandidatesPayload,
    normalizeInvitacionsPayload,
} from '@/services/mappers/invitacio.mapper';
import { authHeader } from '@/services/shared/auth-header';

export const getInvitacionsPerUsuari = async (usuariId: string): Promise<Invitacio[]> => {
    const res = await laravel.get(`/api/invitacions/usuari/${usuariId}`, { headers: authHeader() });
    return normalizeInvitacionsPayload(res.data);
};

export const getInvitacionsPendents = async (usuariId: string): Promise<Invitacio[]> => {
    const res = await laravel.get(`/api/invitacions/usuari/${usuariId}/pendents`, { headers: authHeader() });
    return normalizeInvitacionsPayload(res.data);
};

export const crearInvitacioEquip = async (data: CreateInvitacioData): Promise<string> => {
    const res = await laravel.post('/api/invitacions', data, { headers: authHeader() });
    return String((res.data?.data?.id ?? '') as string);
};

export const respondreInvitacio = async (invitacioId: string, estat: 'acceptada' | 'rebutjada'): Promise<void> => {
    await laravel.patch(`/api/invitacions/${invitacioId}/respondre`, { estat }, { headers: authHeader() });
};

export const getInvitacionsEquip = async (equipId: string): Promise<Invitacio[]> => {
    const res = await laravel.get(`/api/invitacions/equip/${equipId}`, { headers: authHeader() });
    return normalizeInvitacionsPayload(res.data);
};

export const getInvitacioCandidates = async (
    equipId: string,
    params?: { q?: string; limit?: number },
): Promise<InvitacioCandidate[]> => {
    const res = await laravel.get(`/api/admin/equips/${equipId}/candidats-invitacio`, {
        headers: authHeader(),
        params: {
            q: params?.q?.trim() || undefined,
            limit: params?.limit,
        },
    });

    return normalizeInvitacioCandidatesPayload(res.data);
};
