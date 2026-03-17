import { laravel } from '@/api/axios';

export interface Puntuacio {
    id?: string;
    partitId: string;
    equipId: string;
    punts: number;
    stats?: Record<string, unknown>;
    observacions?: string;
}

export interface SetResultat {
    local: number;
    visitant: number;
}

export interface ActaData {
    partitId: string;
    sets: SetResultat[];
    observacions?: string;
    duracio?: number; // minutes
}

const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPuntuacionsPartit = async (partitId: string): Promise<Puntuacio[]> => {
    const res = await laravel.get(`/api/puntuacions/partit/${partitId}`, { headers: authHeader() });
    const data = res.data.data ?? res.data;
    return Array.isArray(data) ? data : (data.puntuacions ?? []);
};

export const crearPuntuacio = async (data: Puntuacio): Promise<Puntuacio> => {
    const res = await laravel.post('/api/puntuacions', data, { headers: authHeader() });
    return res.data.data ?? res.data;
};

export const updatePuntuacio = async (id: string, data: Partial<Puntuacio>): Promise<void> => {
    await laravel.put(`/api/puntuacions/${id}`, data, { headers: authHeader() });
};
