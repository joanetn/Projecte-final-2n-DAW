import type { LeaguesAdminResponse } from '@/types/leagues';

type Dictionary = Record<string, unknown>;

const getCollection = (source: unknown): LeaguesAdminResponse[] => {
    if (Array.isArray(source)) {
        return source as LeaguesAdminResponse[];
    }

    const data = source as Dictionary;

    if (Array.isArray(data.lligues)) {
        return data.lligues as LeaguesAdminResponse[];
    }

    if (data.data && typeof data.data === 'object') {
        const nested = data.data as Dictionary;
        if (Array.isArray(nested.lligues)) {
            return nested.lligues as LeaguesAdminResponse[];
        }
    }

    return [];
};

export const normalizeLeaguesAdminCollection = (
    payload: unknown,
): { lligues: LeaguesAdminResponse[]; total: number } => {
    const collection = getCollection(payload);

    if (collection.length > 0) {
        const source = payload as Dictionary;
        const directTotal = Number(source.total);
        if (Number.isFinite(directTotal) && directTotal >= 0) {
            return { lligues: collection, total: directTotal };
        }

        if (source.data && typeof source.data === 'object') {
            const nested = source.data as Dictionary;
            const nestedTotal = Number(nested.total);
            if (Number.isFinite(nestedTotal) && nestedTotal >= 0) {
                return { lligues: collection, total: nestedTotal };
            }
        }
    }

    return { lligues: collection, total: collection.length };
};
