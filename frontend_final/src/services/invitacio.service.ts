import { laravel } from '@/api/axios';

export interface Invitacio {
    id: string;
    equipId: string;
    equipNom?: string;
    usuariId: string;
    usuariNom?: string;
    status: 'PENDENT' | 'ACCEPTADA' | 'REBUTJADA';
    tipus?: string;
    dataCreacio?: string;
}

const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getInvitacionsPerUsuari = async (usuariId: string): Promise<Invitacio[]> => {
    const res = await laravel.get(`/api/invitacions/usuari/${usuariId}`, { headers: authHeader() });
    const data = res.data.data ?? res.data;
    return Array.isArray(data) ? data : (data.invitacions ?? []);
};

export const getInvitacionsPendents = async (usuariId: string): Promise<Invitacio[]> => {
    const res = await laravel.get(`/api/invitacions/usuari/${usuariId}/pendents`, { headers: authHeader() });
    const data = res.data.data ?? res.data;
    return Array.isArray(data) ? data : (data.invitacions ?? []);
};

export const respondreInvitacio = async (invitacioId: string, status: 'ACCEPTADA' | 'REBUTJADA'): Promise<void> => {
    await laravel.patch(`/api/invitacions/${invitacioId}/respondre`, { status }, { headers: authHeader() });
};

export const getInvitacionsEquip = async (equipId: string): Promise<Invitacio[]> => {
    const res = await laravel.get(`/api/invitacions/equip/${equipId}`, { headers: authHeader() });
    const data = res.data.data ?? res.data;
    return Array.isArray(data) ? data : (data.invitacions ?? []);
};
