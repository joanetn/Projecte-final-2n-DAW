import { laravel } from '@/api/axios';
import type { Alineacio, GuardarAlineacioPayload, JugadorAlineacio } from '@/types/alineacio';
import { authHeader } from '@/services/shared/auth-header';
import { extractArray, unwrapApiData } from '@/services/shared/response-utils';

type AlineacioApiItem = {
    id?: string;
    partitId?: string;
    jugadorId?: string;
    equipId?: string;
    posicio?: string;
    creadaAt?: string;
    createdAt?: string;
    jugador?: {
        id?: string;
        nom?: string;
    } | null;
};

const LEFT_POSITIONS = new Set(['esquerra', 'izquierda', 'left']);
const RIGHT_POSITIONS = new Set(['dreta', 'derecha', 'right']);

const positionOrder = (posicio?: string): number => {
    const normalized = (posicio ?? '').trim().toLowerCase();
    if (LEFT_POSITIONS.has(normalized)) return 0;
    if (RIGHT_POSITIONS.has(normalized)) return 1;
    return 2;
};

const normalizeAlineacions = (items: AlineacioApiItem[]): Alineacio[] => {
    const grouped = new Map<string, Alineacio>();

    for (const item of items) {
        if (!item.partitId || !item.equipId) continue;

        const key = `${item.partitId}:${item.equipId}`;
        if (!grouped.has(key)) {
            grouped.set(key, {
                id: item.id,
                partitId: item.partitId,
                equipId: item.equipId,
                jugadors: [],
                dataCreacio: item.creadaAt ?? item.createdAt,
            });
        }

        const jugadorId = item.jugadorId ?? item.jugador?.id;
        if (!jugadorId) continue;

        const jugador: JugadorAlineacio = {
            usuariId: jugadorId,
            nom: item.jugador?.nom,
            posicio: item.posicio,
        };

        grouped.get(key)!.jugadors.push(jugador);
    }

    const alineacions = Array.from(grouped.values());
    for (const alineacio of alineacions) {
        alineacio.jugadors.sort((a, b) => positionOrder(a.posicio) - positionOrder(b.posicio));
    }

    return alineacions;
};

export const getAlineacioByPartit = async (partitId: string): Promise<Alineacio[]> => {
    const res = await laravel.get(`/api/alineacions/partit/${partitId}`, { headers: authHeader() });
    const data = unwrapApiData<unknown>(res.data);
    const items = extractArray<AlineacioApiItem>(data, ['alineacions']);
    return normalizeAlineacions(items);
};

export const getAlineacio = async (id: string): Promise<Alineacio> => {
    const res = await laravel.get(`/api/alineacions/${id}`, { headers: authHeader() });
    const item = unwrapApiData<AlineacioApiItem>(res.data);
    const jugadorId = item.jugadorId ?? item.jugador?.id;

    return {
        id: item.id,
        partitId: item.partitId ?? '',
        equipId: item.equipId ?? '',
        jugadors: jugadorId
            ? [{ usuariId: jugadorId, nom: item.jugador?.nom, posicio: item.posicio }]
            : [],
        dataCreacio: item.creadaAt ?? item.createdAt,
    };
};

export const crearAlineacio = async (data: GuardarAlineacioPayload): Promise<void> => {
    await laravel.post('/api/alineacions', data, { headers: authHeader() });
};

export const updateAlineacio = async (id: string, data: Partial<Alineacio>): Promise<void> => {
    await laravel.put(`/api/alineacions/${id}`, data, { headers: authHeader() });
};

export const deleteAlineacio = async (id: string): Promise<void> => {
    await laravel.delete(`/api/alineacions/${id}`, { headers: authHeader() });
};
