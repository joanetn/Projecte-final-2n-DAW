import { laravel } from '@/api/axios';
import { unwrapCartResponse, unwrapCheckoutSessionResponse } from '@/services/mappers/cart.mapper';
import { authHeader } from '@/services/shared/auth-header';
import type {
    AddCartItemRequest,
    ApiCartCheckoutConfirmResponse,
    ApiCartCheckoutSessionResponse,
    ApiCartResponse,
    Cart,
    CartCheckoutSession,
    ConfirmCartCheckoutSessionRequest,
    CreateCartCheckoutSessionRequest,
    UpdateCartItemQuantityRequest,
} from '@/types/cart';

export const getMyCart = async (): Promise<Cart> => {
    const res = await laravel.get<ApiCartResponse>('/api/cart', { headers: authHeader() });
    return unwrapCartResponse(res.data);
};

export const addCartItem = async (payload: AddCartItemRequest): Promise<Cart> => {
    const res = await laravel.post<ApiCartResponse>('/api/cart/items', payload, { headers: authHeader() });
    return unwrapCartResponse(res.data);
};

export const updateCartItemQuantity = async (
    itemId: string,
    payload: UpdateCartItemQuantityRequest,
): Promise<Cart> => {
    const res = await laravel.patch<ApiCartResponse>(`/api/cart/items/${itemId}`, payload, { headers: authHeader() });
    return unwrapCartResponse(res.data);
};

export const removeCartItem = async (itemId: string): Promise<Cart> => {
    const res = await laravel.delete<ApiCartResponse>(`/api/cart/items/${itemId}`, { headers: authHeader() });
    return unwrapCartResponse(res.data);
};

export const clearCart = async (): Promise<Cart> => {
    const res = await laravel.delete<ApiCartResponse>('/api/cart', { headers: authHeader() });
    return unwrapCartResponse(res.data);
};

export const createCartCheckoutSession = async (
    payload: CreateCartCheckoutSessionRequest,
): Promise<CartCheckoutSession> => {
    const res = await laravel.post<ApiCartCheckoutSessionResponse>(
        '/api/cart/checkout/session',
        payload,
        { headers: authHeader() },
    );

    return unwrapCheckoutSessionResponse(res.data);
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
