import { laravel } from '@/api/axios';
import type {
    Club,
    CreateClubData,
    UpdateClubData,
    Equip,
    CreateEquipData,
    UpdateEquipData,
    LeagueCategoryOption,
    Lliga,
} from '@/types/club';

const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const unwrapData = <T>(payload: unknown): T => {
    const response = payload as { data?: unknown };
    return (response?.data ?? payload) as T;
};

const normalizeArray = <T>(value: unknown): T[] => {
    if (Array.isArray(value)) {
        return value as T[];
    }

    const maybeWithData = value as { data?: unknown; clubs?: unknown; equips?: unknown; lligues?: unknown };
    if (Array.isArray(maybeWithData?.data)) {
        return maybeWithData.data as T[];
    }

    if (Array.isArray(maybeWithData?.clubs)) {
        return maybeWithData.clubs as T[];
    }

    if (Array.isArray(maybeWithData?.equips)) {
        return maybeWithData.equips as T[];
    }

    if (Array.isArray(maybeWithData?.lligues)) {
        return maybeWithData.lligues as T[];
    }

    return [];
};

// ─── Clubs ────────────────────────────────────────────────────────────────────

export const getClubs = async (): Promise<{ clubs: Club[]; total: number }> => {
    const res = await laravel.get('/api/clubs', { headers: authHeader() });
    const raw = unwrapData<unknown>(res.data);
    const clubs = normalizeArray<Club>(raw);
    const total = (raw as { total?: number })?.total ?? clubs.length;

    return { clubs, total };
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
    const raw = unwrapData<unknown>(res.data);
    const equips = normalizeArray<Equip>(raw);

    return { equips };
};

export const getLeagueCategories = async (): Promise<LeagueCategoryOption[]> => {
    const res = await laravel.get('/api/lligues/categories', { headers: authHeader() });
    const raw = unwrapData<unknown>(res.data);

    return normalizeArray<LeagueCategoryOption>(raw);
};

const normalizeLliga = (value: unknown): Lliga => {
    const lliga = (value ?? {}) as Record<string, unknown>;
    const equipsRaw = Array.isArray(lliga.equips) ? lliga.equips : [];

    return {
        id: String(lliga.id ?? ''),
        nom: String(lliga.nom ?? ''),
        categoria: lliga.categoria as string | undefined,
        dataInici: lliga.dataInici as string | undefined,
        dataFi: lliga.dataFi as string | undefined,
        status: lliga.status as string | undefined,
        isActive: lliga.isActive as boolean | undefined,
        equips: equipsRaw.map((equip) => {
            const item = equip as Record<string, unknown>;
            return {
                id: String(item.id ?? ''),
                nom: String(item.nom ?? ''),
                categoria: item.categoria as string | undefined,
            };
        }),
    };
};

export const getLliguesDisponibles = async (): Promise<Lliga[]> => {
    const res = await laravel.get('/api/lligues', { headers: authHeader() });
    const raw = unwrapData<unknown>(res.data);
    const lligues = normalizeArray<unknown>(raw);

    return lligues.map(normalizeLliga).filter((lliga) => !!lliga.id && !!lliga.nom);
};

export const getLligaDetail = async (lligaId: string): Promise<Lliga> => {
    const res = await laravel.get(`/api/lligues/${lligaId}/detail`, { headers: authHeader() });
    const raw = unwrapData<unknown>(res.data);

    return normalizeLliga(raw);
};

// ─── Equips (user-facing) ─────────────────────────────────────────────────────

export const crearEquip = async (clubId: string, data: CreateEquipData): Promise<Equip> => {
    const res = await laravel.post(`/api/clubs/${clubId}/equips`, data, { headers: authHeader() });
    return res.data.data ?? res.data;
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

export interface MembreEquip {
    id: string;
    usuariId: string;
    equipId: string;
    rolEquip?: string;
    isActive?: boolean;
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
            isActive: item.isActive as boolean | undefined,
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
    const equipsFromMembership: Equip[] = (detail.equipUsuaris ?? []).map((eu: {
        equip?: {
            id: string;
            nom: string;
            categoria?: string;
            clubId?: string;
            lligaId?: string;
            lligaNom?: string;
            isActive?: boolean;
        };
        equipId?: string;
        rolEquip?: string;
        isActive?: boolean;
    }) => ({
        id: eu.equip?.id ?? eu.equipId ?? '',
        nom: eu.equip?.nom ?? '',
        categoria: eu.equip?.categoria,
        clubId: eu.equip?.clubId,
        lligaId: eu.equip?.lligaId,
        lligaNom: eu.equip?.lligaNom,
        isActive: eu.isActive ?? eu.equip?.isActive ?? true,
        rolMeu: eu.rolEquip,
    }));

    const equipsById = new Map<string, Equip>();
    equipsFromMembership
        .filter((equip) => equip.id)
        .forEach((equip) => {
            equipsById.set(equip.id, equip);
        });

    try {
        const clubsResponse = await getClubs();
        const equipInfoById = new Map<string, {
            nom?: string;
            categoria?: string;
            clubId?: string;
            isActive?: boolean;
        }>();

        clubsResponse.clubs.forEach((club) => {
            (club.equips ?? []).forEach((equip) => {
                if (equip.id) {
                    equipInfoById.set(equip.id, {
                        nom: equip.nom,
                        categoria: equip.categoria,
                        clubId: club.id,
                        isActive: equip.isActive,
                    });
                }
            });
        });

        Array.from(equipsById.entries()).forEach(([equipId, equip]) => {
            const info = equipInfoById.get(equipId);

            if (info) {
                equipsById.set(equipId, {
                    ...equip,
                    nom: equip.nom || info.nom || '',
                    categoria: equip.categoria ?? info.categoria,
                    clubId: equip.clubId ?? info.clubId,
                    isActive: equip.isActive ?? info.isActive ?? true,
                });
            }
        });

        const managedClubs = clubsResponse.clubs.filter((club) => club.creadorId === usuariId);

        if (managedClubs.length > 0) {
            const managedEquipsResults = await Promise.all(
                managedClubs.map(async (club) => {
                    try {
                        return await getEquipsClub(club.id);
                    } catch {
                        return { equips: [] as Equip[] };
                    }
                }),
            );

            managedEquipsResults
                .flatMap((result) => result.equips)
                .filter((equip) => equip.id)
                .forEach((equip) => {
                    if (!equipsById.has(equip.id)) {
                        equipsById.set(equip.id, equip);
                    }
                });
        }
    } catch {
        // fallback to memberships only
    }

    const equips = Array.from(equipsById.values()).map((equip) => ({
        ...equip,
        nom: equip.nom || `Equip #${equip.id.slice(0, 8)}`,
        isActive: equip.isActive ?? true,
    }));

    return { equips };
};
