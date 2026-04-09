type Dictionary = Record<string, unknown>;

export const unwrapApiData = <T>(payload: unknown): T => {
    const response = payload as Dictionary;
    return (response.data ?? payload) as T;
};

export const extractArray = <T>(payload: unknown, keys: string[] = []): T[] => {
    if (Array.isArray(payload)) {
        return payload as T[];
    }

    const source = payload as Dictionary;

    if (Array.isArray(source.data)) {
        return source.data as T[];
    }

    for (const key of keys) {
        if (Array.isArray(source[key])) {
            return source[key] as T[];
        }
    }

    if (source.data && typeof source.data === 'object') {
        const nested = source.data as Dictionary;
        for (const key of keys) {
            if (Array.isArray(nested[key])) {
                return nested[key] as T[];
            }
        }
    }

    return [];
};
