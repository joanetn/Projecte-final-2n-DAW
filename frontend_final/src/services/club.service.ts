import { laravel } from '@/api/axios';
import type { Club, CreateClubData, UpdateClubData, Equip, CreateEquipData } from '@/types/club';

const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Clubs ────────────────────────────────────────────────────────────────────

export const getClubs = async (): Promise<{ clubs: Club[]; total: number }> => {
    const res = await laravel.get('/api/clubs', { headers: authHeader() });
    return res.data.data ?? res.data;
};

export const getClub = async (clubId: string): Promise<Club> => {
    const res = await laravel.get(`/api/clubs/${clubId}`, { headers: authHeader() });
    return res.data.data ?? res.data.club ?? res.data;
};

export const crearClub = async (data: CreateClubData): Promise<Club> => {
    const res = await laravel.post('/api/clubs', data, { headers: authHeader() });
    return res.data.data ?? res.data;
};

export const actualitzarClub = async (clubId: string, data: UpdateClubData): Promise<void> => {
    await laravel.put(`/api/clubs/${clubId}`, data, { headers: authHeader() });
};

export const eliminarClub = async (clubId: string): Promise<void> => {
    await laravel.delete(`/api/clubs/${clubId}`, { headers: authHeader() });
};

export const getEquipsClub = async (clubId: string): Promise<{ equips: Equip[] }> => {
    const res = await laravel.get(`/api/clubs/${clubId}/equips`, { headers: authHeader() });
    return res.data.data ?? res.data;
};

// ─── Equips (user-facing) ─────────────────────────────────────────────────────

export const crearEquip = async (clubId: string, data: CreateEquipData): Promise<Equip> => {
    const res = await laravel.post(`/api/clubs/${clubId}/equips`, data, { headers: authHeader() });
    return res.data.data ?? res.data;
};

export interface MembreEquip {
    id: string;
    usuariId: string;
    equipId: string;
    rolEquip?: string;
    nom?: string;
    email?: string;
    teSeguir?: boolean;
    lesionat?: boolean;
    dataLesio?: string;
}

export const getEquipMembres = async (equipId: string): Promise<{ membres: MembreEquip[] }> => {
    const res = await laravel.get(`/api/admin/equips/${equipId}/membres`, { headers: authHeader() });
    const data = res.data.data ?? res.data;
    const raw: unknown[] = Array.isArray(data) ? data : (data.membres ?? []);
    const membres: MembreEquip[] = raw.map((m: unknown) => {
        const item = m as Record<string, unknown>;
        const user = (item.usuari ?? {}) as Record<string, unknown>;
        return {
            id: String(item.id ?? ''),
            usuariId: String(item.usuariId ?? user.id ?? ''),
            equipId: String(item.equipId ?? ''),
            rolEquip: item.rolEquip as string | undefined,
            nom: (item.nom ?? user.nom) as string | undefined,
            email: (item.email ?? user.email) as string | undefined,
            teSeguir: (item.teSeguir ?? user.teSeguir) as boolean | undefined,
            lesionat: (item.lesionat ?? user.lesionat) as boolean | undefined,
            dataLesio: (item.dataLesio ?? user.dataLesio) as string | undefined,
        };
    });
    return { membres };
};

export const getMeusEquips = async (usuariId: string): Promise<{ equips: Equip[] }> => {
    // Get user detail which includes their equip memberships
    const res = await laravel.get(`/api/usuaris/${usuariId}/detail`, { headers: authHeader() });
    const detail = res.data.data ?? res.data;
    // Map equipUsuaris to Equip shape
    const equips: Equip[] = (detail.equipUsuaris ?? []).map((eu: { equip?: { id: string; nom: string; categoria?: string }; equipId?: string; rolEquip?: string }) => ({
        id: eu.equip?.id ?? eu.equipId ?? '',
        nom: eu.equip?.nom ?? '',
        categoria: eu.equip?.categoria,
        rolMeu: eu.rolEquip,
    }));
    return { equips };
};
