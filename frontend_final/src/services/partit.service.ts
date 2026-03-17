import { laravel } from '@/api/axios';

export interface Partit {
    id: string;
    localId: string;
    visitantId: string;
    localNom?: string;
    visitantNom?: string;
    dataHora: string;
    ubicacio?: string;
    lligaId?: string;
    lligaNom?: string;
    status: 'PENDENT' | 'PROGRAMAT' | 'EN_CURS' | 'COMPLETAT' | 'CANCELAT' | 'SENSE_ARBITRE';
    arbitreId?: string;
    arbitreNom?: string;
    setsLocal?: number;
    setsVisitant?: number;
}

export interface CreatePartitData {
    localId: string;
    visitantId: string;
    dataHora: string;
    ubicacio?: string;
    lligaId?: string;
}

const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPartits = async (params?: { arbitreId?: string; equipId?: string; status?: string }): Promise<{ partits: Partit[] }> => {
    const res = await laravel.get('/api/partits', { headers: authHeader(), params });
    const data = res.data.data ?? res.data;
    const partits = Array.isArray(data) ? data : (data.partits ?? []);
    return { partits };
};

export const getPartit = async (id: string): Promise<Partit> => {
    const res = await laravel.get(`/api/partits/${id}/detail`, { headers: authHeader() });
    return res.data.data ?? res.data.partit ?? res.data;
};

export const crearPartit = async (data: CreatePartitData): Promise<Partit> => {
    const res = await laravel.post('/api/partits', data, { headers: authHeader() });
    return res.data.data ?? res.data;
};

export const updatePartit = async (id: string, data: Partial<CreatePartitData & { status: string }>): Promise<void> => {
    await laravel.put(`/api/partits/${id}`, data, { headers: authHeader() });
};

export const deletePartit = async (id: string): Promise<void> => {
    await laravel.delete(`/api/partits/${id}`, { headers: authHeader() });
};

export const assignArbitre = async (partitId: string, arbitreId: string): Promise<void> => {
    await laravel.post(`/api/partits/${partitId}/assign-arbitre`, { arbitreId }, { headers: authHeader() });
};
