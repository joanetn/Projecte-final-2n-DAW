import { laravel } from '@/api/axios';

export type InvitationStatus = 'pendent' | 'acceptada' | 'rebutjada' | 'cancelada';

export interface Invitacio {
    id: string;
    equipId: string;
    equipNom?: string;
    usuariId: string;
    usuariNom?: string;
    tipus?: string;
    missatge?: string;
    estat: InvitationStatus;
    status: 'PENDENT' | 'ACCEPTADA' | 'REBUTJADA' | 'CANCELADA';
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    dataCreacio?: string;
}

export interface CreateInvitacioData {
    equipId: string;
    usuariId: string;
    missatge?: string;
}

const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const toStatusLabel = (estat: InvitationStatus): Invitacio['status'] => {
    if (estat === 'acceptada') return 'ACCEPTADA';
    if (estat === 'rebutjada') return 'REBUTJADA';
    if (estat === 'cancelada') return 'CANCELADA';
    return 'PENDENT';
};

const normalizeInvitacio = (value: unknown): Invitacio => {
    const item = (value ?? {}) as Record<string, unknown>;
    const equip = (item.equip ?? {}) as Record<string, unknown>;
    const usuari = (item.usuari ?? {}) as Record<string, unknown>;

    const estatRaw = String(item.estat ?? item.status ?? 'pendent').toLowerCase();
    const estat: InvitationStatus = ['acceptada', 'rebutjada', 'cancelada'].includes(estatRaw)
        ? (estatRaw as InvitationStatus)
        : 'pendent';

    const createdAt = (item.createdAt ?? item.dataCreacio) as string | undefined;

    return {
        id: String(item.id ?? ''),
        equipId: String(item.equipId ?? equip.id ?? ''),
        equipNom: (item.equipNom ?? equip.nom) as string | undefined,
        usuariId: String(item.usuariId ?? usuari.id ?? ''),
        usuariNom: (item.usuariNom ?? usuari.nom) as string | undefined,
        missatge: item.missatge as string | undefined,
        estat,
        status: toStatusLabel(estat),
        isActive: item.isActive as boolean | undefined,
        createdAt,
        updatedAt: item.updatedAt as string | undefined,
        dataCreacio: createdAt,
    };
};

const normalizeInvitacions = (payload: unknown): Invitacio[] => {
    const data = (payload as { data?: unknown })?.data ?? payload;
    const raw = Array.isArray(data)
        ? data
        : (((data as { invitacions?: unknown })?.invitacions ?? []) as unknown[]);

    return raw.map(normalizeInvitacio);
};

export const getInvitacionsPerUsuari = async (usuariId: string): Promise<Invitacio[]> => {
    const res = await laravel.get(`/api/invitacions/usuari/${usuariId}`, { headers: authHeader() });
    return normalizeInvitacions(res.data);
};

export const getInvitacionsPendents = async (usuariId: string): Promise<Invitacio[]> => {
    const res = await laravel.get(`/api/invitacions/usuari/${usuariId}/pendents`, { headers: authHeader() });
    return normalizeInvitacions(res.data);
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
    return normalizeInvitacions(res.data);
};
