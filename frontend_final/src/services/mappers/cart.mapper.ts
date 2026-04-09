import type {
    ApiCartCheckoutSessionResponse,
    ApiCartResponse,
    Cart,
    CartCheckoutSession,
    CartItem,
} from '@/types/cart';

type Dictionary = Record<string, unknown>;

const toNumber = (value: unknown, fallback = 0): number => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

const normalizeItem = (item: unknown): CartItem => {
    const i = item as Dictionary;

    return {
        id: String(i.id ?? ''),
        cartId: String(i.cartId ?? ''),
        merchId: String(i.merchId ?? ''),
        quantitat: toNumber(i.quantitat, 0),
        isActive: Boolean(i.isActive ?? true),
        createdAt: (i.createdAt as string | null | undefined) ?? null,
        updatedAt: (i.updatedAt as string | null | undefined) ?? null,
        subtotal: toNumber(i.subtotal, 0),
        merch: i.merch
            ? {
                id: String((i.merch as Dictionary).id ?? ''),
                nom: (i.merch as Dictionary).nom as string | undefined,
                marca: (i.merch as Dictionary).marca as string | undefined,
                preu: toNumber((i.merch as Dictionary).preu, 0),
                stock: toNumber((i.merch as Dictionary).stock, 0),
                isActive: Boolean((i.merch as Dictionary).isActive ?? true),
            }
            : null,
    };
};

export const normalizeCart = (cart: unknown): Cart => {
    const c = cart as Dictionary;
    const rawItems = c.items;

    const itemList = Array.isArray(rawItems)
        ? rawItems
        : Array.isArray((rawItems as Dictionary | undefined)?.data)
            ? ((rawItems as Dictionary).data as unknown[])
            : [];

    return {
        id: String(c.id ?? ''),
        usuariId: String(c.usuariId ?? ''),
        isActive: Boolean(c.isActive ?? true),
        createdAt: (c.createdAt as string | null | undefined) ?? null,
        updatedAt: (c.updatedAt as string | null | undefined) ?? null,
        totalItems: toNumber(c.totalItems, 0),
        totalAmount: toNumber(c.totalAmount, 0),
        items: itemList.map(normalizeItem),
    };
};

export const unwrapCartResponse = (response: ApiCartResponse): Cart => {
    if (!response?.data) {
        throw new Error(response?.message || 'Resposta de cistella invàlida');
    }

    return normalizeCart(response.data);
};

export const unwrapCheckoutSessionResponse = (
    response: ApiCartCheckoutSessionResponse,
): CartCheckoutSession => {
    if (!response?.data) {
        throw new Error(response?.message || 'Resposta de checkout invàlida');
    }

    return {
        sessionId: String(response.data.sessionId ?? ''),
        checkoutUrl: String(response.data.checkoutUrl ?? ''),
    };
};
