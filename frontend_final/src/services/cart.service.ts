import { laravel } from '@/api/axios';
import type {
    AddCartItemRequest,
    ApiCartCheckoutConfirmResponse,
    ApiCartCheckoutSessionResponse,
    ApiCartResponse,
    Cart,
    CartCheckoutSession,
    ConfirmCartCheckoutSessionRequest,
    CartItem,
    CreateCartCheckoutSessionRequest,
    UpdateCartItemQuantityRequest,
} from '@/types/cart';

const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const toNumber = (value: unknown, fallback = 0): number => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

const normalizeItem = (item: unknown): CartItem => {
    const i = item as Record<string, unknown>;
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
                id: String((i.merch as Record<string, unknown>).id ?? ''),
                nom: (i.merch as Record<string, unknown>).nom as string | undefined,
                marca: (i.merch as Record<string, unknown>).marca as string | undefined,
                preu: toNumber((i.merch as Record<string, unknown>).preu, 0),
                stock: toNumber((i.merch as Record<string, unknown>).stock, 0),
                isActive: Boolean((i.merch as Record<string, unknown>).isActive ?? true),
            }
            : null,
    };
};

const normalizeCart = (cart: unknown): Cart => {
    const c = cart as Record<string, unknown>;
    const rawItems = c.items;

    const itemList = Array.isArray(rawItems)
        ? rawItems
        : Array.isArray((rawItems as Record<string, unknown> | undefined)?.data)
            ? ((rawItems as Record<string, unknown>).data as unknown[])
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

const unwrapCart = (response: ApiCartResponse): Cart => {
    if (!response?.data) {
        throw new Error(response?.message || 'Respuesta de carrito inválida');
    }
    return normalizeCart(response.data);
};

const unwrapCheckoutSession = (response: ApiCartCheckoutSessionResponse): CartCheckoutSession => {
    if (!response?.data) {
        throw new Error(response?.message || 'Respuesta de checkout inválida');
    }

    return {
        sessionId: String(response.data.sessionId ?? ''),
        checkoutUrl: String(response.data.checkoutUrl ?? ''),
    };
};

export const getMyCart = async (): Promise<Cart> => {
    const res = await laravel.get<ApiCartResponse>('/api/cart', { headers: authHeader() });
    return unwrapCart(res.data);
};

export const addCartItem = async (payload: AddCartItemRequest): Promise<Cart> => {
    const res = await laravel.post<ApiCartResponse>('/api/cart/items', payload, { headers: authHeader() });
    return unwrapCart(res.data);
};

export const updateCartItemQuantity = async (
    itemId: string,
    payload: UpdateCartItemQuantityRequest,
): Promise<Cart> => {
    const res = await laravel.patch<ApiCartResponse>(`/api/cart/items/${itemId}`, payload, { headers: authHeader() });
    return unwrapCart(res.data);
};

export const removeCartItem = async (itemId: string): Promise<Cart> => {
    const res = await laravel.delete<ApiCartResponse>(`/api/cart/items/${itemId}`, { headers: authHeader() });
    return unwrapCart(res.data);
};

export const clearCart = async (): Promise<Cart> => {
    const res = await laravel.delete<ApiCartResponse>('/api/cart', { headers: authHeader() });
    return unwrapCart(res.data);
};

export const createCartCheckoutSession = async (
    payload: CreateCartCheckoutSessionRequest,
): Promise<CartCheckoutSession> => {
    const res = await laravel.post<ApiCartCheckoutSessionResponse>(
        '/api/cart/checkout/session',
        payload,
        { headers: authHeader() },
    );

    return unwrapCheckoutSession(res.data);
};

export const confirmCartCheckoutSession = async (
    payload: ConfirmCartCheckoutSessionRequest,
): Promise<ApiCartCheckoutConfirmResponse> => {
    const res = await laravel.post<ApiCartCheckoutConfirmResponse>(
        '/api/cart/checkout/confirm',
        payload,
        { headers: authHeader() },
    );

    return res.data;
};
