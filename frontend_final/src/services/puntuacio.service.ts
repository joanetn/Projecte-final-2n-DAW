import { laravel } from '@/api/axios';
import { authHeader } from '@/services/shared/auth-header';
import { extractArray, unwrapApiData } from '@/services/shared/response-utils';
import type { Puntuacio } from '@/types/puntuacio';

export const getPuntuacionsPartit = async (partitId: string): Promise<Puntuacio[]> => {
    const res = await laravel.get(`/api/puntuacions/partit/${partitId}`, { headers: authHeader() });
    const payload = unwrapApiData<unknown>(res.data);
    return extractArray<Puntuacio>(payload, ['puntuacions']);
};

export const crearPuntuacio = async (data: Puntuacio): Promise<Puntuacio> => {
    const res = await laravel.post('/api/puntuacions', data, { headers: authHeader() });
    return unwrapApiData<Puntuacio>(res.data);
};

export const updatePuntuacio = async (id: string, data: Partial<Puntuacio>): Promise<void> => {
    await laravel.put(`/api/puntuacions/${id}`, data, { headers: authHeader() });
};
