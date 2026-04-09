import { laravel } from '@/api/axios';
import type { Alineacio } from '@/types/alineacio';
import { authHeader } from '@/services/shared/auth-header';
import { extractArray, unwrapApiData } from '@/services/shared/response-utils';

export const getAlineacioByPartit = async (partitId: string): Promise<Alineacio[]> => {
    const res = await laravel.get(`/api/alineacions/partit/${partitId}`, { headers: authHeader() });
    const data = unwrapApiData<unknown>(res.data);
    return extractArray<Alineacio>(data, ['alineacions']);
};

export const getAlineacio = async (id: string): Promise<Alineacio> => {
    const res = await laravel.get(`/api/alineacions/${id}`, { headers: authHeader() });
    const data = unwrapApiData<Record<string, unknown>>(res.data);
    return (data.alineacio as Alineacio | undefined) ?? (data as unknown as Alineacio);
};

export const crearAlineacio = async (data: Alineacio): Promise<Alineacio> => {
    const res = await laravel.post('/api/alineacions', data, { headers: authHeader() });
    return unwrapApiData<Alineacio>(res.data);
};

export const updateAlineacio = async (id: string, data: Partial<Alineacio>): Promise<void> => {
    await laravel.put(`/api/alineacions/${id}`, data, { headers: authHeader() });
};

export const deleteAlineacio = async (id: string): Promise<void> => {
    await laravel.delete(`/api/alineacions/${id}`, { headers: authHeader() });
};
