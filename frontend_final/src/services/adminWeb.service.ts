import { laravel } from '@/api/axios';
import type {
    EstadistiquesAdminWeb,
    UsuariAdmin,
    EquipAdmin,
    LligaAdmin,
    PartitAdmin,
    ArbitreAdmin,
    MembreEquip,
    ClassificacioEntry,
    CreateEquipData,
    UpdateEquipData,
    CreateLligaData,
    UpdateLligaData,
    CreatePartitData,
    UpdatePartitData,
    LligaEquipsResponse,
    GenerateLligaFixturesResponse,
    GetUsuarisParams,
    GetEquipsParams,
    GetPartitsParams,
    GetPropostesReprogramacioParams,
    GetMevesPropostesResponse,
    CreatePropostaReprogramacioData,
    RespondrePropostaReprogramacioData,
} from '@/types/admin';

const BASE = '/api/admin-web';

// Helper para obtener el token del localStorage
const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Estadístiques ────────────────────────────────────────────────────────────

export const getEstadistiquesAdminWeb = async (): Promise<EstadistiquesAdminWeb> => {
    const res = await laravel.get(`${BASE}/estadistiques`, { headers: authHeader() });
    return res.data.data;
};

// ─── Usuaris ─────────────────────────────────────────────────────────────────

export const getUsuarisAdmin = async (
    params?: GetUsuarisParams
): Promise<{ usuaris: UsuariAdmin[]; total: number }> => {
    const res = await laravel.get(`${BASE}/usuaris`, {
        headers: authHeader(),
        params,
    });
    return res.data.data;
};

export const toggleUsuariActiu = async (usuariId: string): Promise<void> => {
    await laravel.patch(`${BASE}/usuaris/${usuariId}/toggle`, {}, { headers: authHeader() });
};

export const canviarRolsUsuari = async (usuariId: string, rols: string[]): Promise<void> => {
    await laravel.patch(
        `${BASE}/usuaris/${usuariId}/rols`,
        { rols },
        { headers: authHeader() }
    );
};

export const eliminarUsuari = async (usuariId: string): Promise<void> => {
    await laravel.delete(`${BASE}/usuaris/${usuariId}`, { headers: authHeader() });
};

// ─── Equips ───────────────────────────────────────────────────────────────────

export const getEquipsAdmin = async (
    params?: GetEquipsParams
): Promise<{ equips: EquipAdmin[]; total: number }> => {
    const res = await laravel.get(`${BASE}/equips`, { headers: authHeader(), params });
    return res.data.data;
};

export const crearEquip = async (data: CreateEquipData): Promise<EquipAdmin> => {
    const res = await laravel.post(`${BASE}/equips`, data, { headers: authHeader() });
    return res.data.data;
};

export const actualitzarEquip = async (
    equipId: string,
    data: UpdateEquipData
): Promise<void> => {
    await laravel.patch(`${BASE}/equips/${equipId}`, data, { headers: authHeader() });
};

export const eliminarEquip = async (equipId: string): Promise<void> => {
    await laravel.delete(`${BASE}/equips/${equipId}`, { headers: authHeader() });
};

export const getMembresEquip = async (
    equipId: string
): Promise<{ membres: MembreEquip[] }> => {
    const res = await laravel.get(`${BASE}/equips/${equipId}/membres`, {
        headers: authHeader(),
    });
    return res.data.data;
};

// ─── Lligues ─────────────────────────────────────────────────────────────────

export const getLliguesAdmin = async (): Promise<{ lligues: LligaAdmin[]; total: number }> => {
    const res = await laravel.get(`${BASE}/lligues`, { headers: authHeader() });
    return res.data.data;
};

export const crearLliga = async (data: CreateLligaData): Promise<LligaAdmin> => {
    const res = await laravel.post(`${BASE}/lligues`, data, { headers: authHeader() });
    return res.data.data;
};

export const actualitzarLliga = async (
    lligaId: string,
    data: UpdateLligaData
): Promise<void> => {
    await laravel.patch(`${BASE}/lligues/${lligaId}`, data, { headers: authHeader() });
};

export const eliminarLliga = async (lligaId: string): Promise<void> => {
    await laravel.delete(`${BASE}/lligues/${lligaId}`, { headers: authHeader() });
};

export const getEquipsLligaAdmin = async (lligaId: string): Promise<LligaEquipsResponse> => {
    const res = await laravel.get(`${BASE}/lligues/${lligaId}/equips`, { headers: authHeader() });
    return res.data.data;
};

export const generarPartitsLligaAdmin = async (
    lligaId: string,
    force: boolean = false
): Promise<GenerateLligaFixturesResponse> => {
    const res = await laravel.post(
        `${BASE}/lligues/${lligaId}/generar-partits`,
        { force },
        { headers: authHeader() }
    );
    return res.data.data;
};

// ─── Partits ─────────────────────────────────────────────────────────────────

export const getPartitsAdmin = async (
    params?: GetPartitsParams
): Promise<{ partits: PartitAdmin[]; total: number }> => {
    const res = await laravel.get(`${BASE}/partits`, { headers: authHeader(), params });
    return res.data.data;
};

export const crearPartit = async (data: CreatePartitData): Promise<PartitAdmin> => {
    const res = await laravel.post(`${BASE}/partits`, data, { headers: authHeader() });
    return res.data.data;
};

export const actualitzarPartit = async (
    partitId: string,
    data: UpdatePartitData
): Promise<void> => {
    await laravel.patch(`${BASE}/partits/${partitId}`, data, { headers: authHeader() });
};

export const eliminarPartit = async (partitId: string): Promise<void> => {
    await laravel.delete(`${BASE}/partits/${partitId}`, { headers: authHeader() });
};

// ─── Àrbitres ─────────────────────────────────────────────────────────────────

export const getArbitresAdmin = async (): Promise<{ arbitres: ArbitreAdmin[] }> => {
    const res = await laravel.get(`${BASE}/arbitres`, { headers: authHeader() });
    return res.data.data;
};

export const assignarArbitre = async (
    partitId: string,
    arbitreId: string | null
): Promise<void> => {
    await laravel.patch(
        `${BASE}/partits/${partitId}/arbitre`,
        { arbitreId },
        { headers: authHeader() }
    );
};

export const getPartitsArbitre = async (
    arbitreId: string
): Promise<{ partits: PartitAdmin[] }> => {
    const res = await laravel.get(`${BASE}/arbitres/${arbitreId}/partits`, {
        headers: authHeader(),
    });
    return res.data.data;
};

// ─── Reprogramacions ─────────────────────────────────────────────────────────

export const getMevesPropostesReprogramacio = async (
    params?: GetPropostesReprogramacioParams
): Promise<GetMevesPropostesResponse> => {
    const res = await laravel.get(`${BASE}/propostes-reprogramacio/me`, {
        headers: authHeader(),
        params,
    });

    return res.data.data;
};

export const crearPropostaReprogramacio = async (
    partitId: string,
    data: CreatePropostaReprogramacioData
): Promise<{ id: string }> => {
    const res = await laravel.post(
        `${BASE}/partits/${partitId}/propostes-reprogramacio`,
        data,
        { headers: authHeader() }
    );

    return res.data.data;
};

export const respondrePropostaReprogramacio = async (
    propostaId: string,
    data: RespondrePropostaReprogramacioData
): Promise<{ accepted: boolean }> => {
    const res = await laravel.patch(
        `${BASE}/propostes-reprogramacio/${propostaId}/respondre`,
        data,
        { headers: authHeader() }
    );

    return res.data.data;
};

// ─── Classificacions ─────────────────────────────────────────────────────────

export const getClassificacionsAdmin = async (): Promise<{
    classificacions: Record<string, ClassificacioEntry[]>;
}> => {
    const res = await laravel.get(`${BASE}/classificacions`, { headers: authHeader() });
    return res.data.data;
};
