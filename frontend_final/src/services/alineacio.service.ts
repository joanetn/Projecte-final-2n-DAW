import { laravel } from '@/api/axios';

export interface JugadorAlineacio {
    usuariId: string;
    nom?: string;
    dorsal?: number;
    posicio?: string;
    titular: boolean;
    teSeguir?: boolean;
    lesionat?: boolean;
}

export interface Alineacio {
    id?: string;
    partitId: string;
    equipId: string;
    jugadors: JugadorAlineacio[];
    dataCreacio?: string;
}

const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAlineacioByPartit = async (partitId: string): Promise<Alineacio[]> => {
    const res = await laravel.get(`/api/alineacions/partit/${partitId}`, { headers: authHeader() });
    const data = res.data.data ?? res.data;
    return Array.isArray(data) ? data : (data.alineacions ?? []);
};

export const getAlineacio = async (id: string): Promise<Alineacio> => {
    const res = await laravel.get(`/api/alineacions/${id}`, { headers: authHeader() });
    return res.data.data ?? res.data.alineacio ?? res.data;
};

export const crearAlineacio = async (data: Alineacio): Promise<Alineacio> => {
    const res = await laravel.post('/api/alineacions', data, { headers: authHeader() });
    return res.data.data ?? res.data;
};

export const updateAlineacio = async (id: string, data: Partial<Alineacio>): Promise<void> => {
    await laravel.put(`/api/alineacions/${id}`, data, { headers: authHeader() });
};

export const deleteAlineacio = async (id: string): Promise<void> => {
    await laravel.delete(`/api/alineacions/${id}`, { headers: authHeader() });
};
