import { laravel } from '@/api/axios';
import type {
    Club,
    CreateClubData,
    UpdateClubData,
    Equip,
    MembreEquip,
    CreateEquipData,
    UpdateEquipData,
    LeagueCategoryOption,
    Lliga,
} from '@/types/club';
import { normalizeEquip, normalizeLliga, normalizeMembres } from '@/services/mappers/club.mapper';
import { authHeader } from '@/services/shared/auth-header';
import { extractArray, unwrapApiData } from '@/services/shared/response-utils';

// ─── Clubs ────────────────────────────────────────────────────────────────────

export const getClubs = async (): Promise<{ clubs: Club[]; total: number }> => {
    const res = await laravel.get('/api/clubs', { headers: authHeader() });
    const raw = unwrapApiData<Record<string, unknown>>(res.data);
    const clubs = extractArray<Club>(raw, ['clubs']);
    const total = Number(raw.total ?? clubs.length);

    return { clubs, total };
};

export const getClub = async (clubId: string): Promise<Club> => {
    const res = await laravel.get(`/api/clubs/${clubId}`, { headers: authHeader() });
    const raw = unwrapApiData<Record<string, unknown>>(res.data);
    return (raw.club as Club | undefined) ?? (raw as unknown as Club);
};

export const crearClub = async (data: CreateClubData): Promise<Club> => {
    const res = await laravel.post('/api/clubs', data, { headers: authHeader() });
    return unwrapApiData<Club>(res.data);
};

export const actualitzarClub = async (clubId: string, data: UpdateClubData): Promise<void> => {
    await laravel.put(`/api/clubs/${clubId}`, data, { headers: authHeader() });
};

export const eliminarClub = async (clubId: string): Promise<void> => {
    await laravel.delete(`/api/clubs/${clubId}`, { headers: authHeader() });
};

export const getEquipsClub = async (clubId: string): Promise<{ equips: Equip[] }> => {
    const res = await laravel.get(`/api/clubs/${clubId}/equips`, { headers: authHeader() });
    const raw = unwrapApiData<unknown>(res.data);
    const equips = extractArray<Equip>(raw, ['equips']);

    return { equips };
};

export const getLeagueCategories = async (): Promise<LeagueCategoryOption[]> => {
    const res = await laravel.get('/api/lligues/categories', { headers: authHeader() });
    const raw = unwrapApiData<unknown>(res.data);
    return extractArray<LeagueCategoryOption>(raw);
};

export const getLliguesDisponibles = async (): Promise<Lliga[]> => {
    const res = await laravel.get('/api/lligues', { headers: authHeader() });
    const raw = unwrapApiData<unknown>(res.data);
    const lligues = extractArray<unknown>(raw, ['lligues']);

    return lligues.map(normalizeLliga).filter((lliga) => !!lliga.id && !!lliga.nom);
};

export const getLligaDetail = async (lligaId: string): Promise<Lliga> => {
    const res = await laravel.get(`/api/lligues/${lligaId}/detail`, { headers: authHeader() });
    const raw = unwrapApiData<unknown>(res.data);

    return normalizeLliga(raw);
};

// ─── Equips (user-facing) ─────────────────────────────────────────────────────

export const crearEquip = async (clubId: string, data: CreateEquipData): Promise<Equip> => {
    const res = await laravel.post(`/api/clubs/${clubId}/equips`, data, { headers: authHeader() });
    return unwrapApiData<Equip>(res.data);
};

export const actualitzarEquip = async (clubId: string, equipId: string, data: UpdateEquipData): Promise<void> => {
    await laravel.put(`/api/clubs/${clubId}/equips/${equipId}`, data, { headers: authHeader() });
};

export const inscriureEquipALliga = async (clubId: string, equipId: string, lligaId: string): Promise<void> => {
    await laravel.post(
        `/api/clubs/${clubId}/equips/${equipId}/inscripcio-lliga`,
        { lligaId },
        { headers: authHeader() },
    );
};

export const getEquipMembres = async (equipId: string): Promise<{ membres: MembreEquip[] }> => {
    const res = await laravel.get(`/api/admin/equips/${equipId}/membres`, { headers: authHeader() });
    const raw = unwrapApiData<unknown>(res.data);
    const membres = normalizeMembres(extractArray<unknown>(raw, ['membres']));

    return { membres };
};

export const getMeusEquips = async (_usuariId: string): Promise<{ equips: Equip[] }> => {
    const res = await laravel.get('/api/usuaris/me/equips', { headers: authHeader() });
    const raw = unwrapApiData<unknown>(res.data);
    const equips = extractArray<unknown>(raw, ['equips'])
        .map(normalizeEquip)
        .filter((equip) => equip.id.length > 0);

    return { equips };
};
