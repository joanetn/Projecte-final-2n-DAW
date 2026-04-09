import { laravel } from '@/api/axios';
import { authHeader } from '@/services/shared/auth-header';
import { extractArray, unwrapApiData } from '@/services/shared/response-utils';
import type { CreatePartitData, Partit } from '@/types/partit';

export const getPartits = async (params?: { arbitreId?: string; equipId?: string; equipIds?: string; status?: string }): Promise<{ partits: Partit[] }> => {
    const res = await laravel.get('/api/partits', { headers: authHeader(), params });
    const data = unwrapApiData<unknown>(res.data);
    const partits = extractArray<Partit>(data, ['partits']);
    return { partits };
};

export const getPartit = async (id: string): Promise<Partit> => {
    const res = await laravel.get(`/api/partits/${id}/detail`, { headers: authHeader() });
    const data = unwrapApiData<Record<string, unknown>>(res.data);
    return (data.partit as Partit | undefined) ?? (data as unknown as Partit);
};

export const crearPartit = async (data: CreatePartitData): Promise<Partit> => {
    const res = await laravel.post('/api/partits', data, { headers: authHeader() });
    return unwrapApiData<Partit>(res.data);
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
