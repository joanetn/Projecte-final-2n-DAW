import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    addCartItem,
    clearCart,
    confirmCartCheckoutSession,
    createCartCheckoutSession,
    removeCartItem,
    updateCartItemQuantity,
} from '@/services/cart.service';
import type {
    AddCartItemRequest,
    ConfirmCartCheckoutSessionRequest,
    CreateCartCheckoutSessionRequest,
    UpdateCartItemQuantityRequest,
} from '@/types/cart';
import { CART_KEYS } from '@/queries/cart.queries';

export const useAddCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddCartItemRequest) => addCartItem(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_KEYS.me });
        },
    });
};

export const useUpdateCartItemQuantity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            itemId,
            payload,
        }: {
            itemId: string;
            payload: UpdateCartItemQuantityRequest;
        }) => updateCartItemQuantity(itemId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_KEYS.me });
        },
    });
};

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: string) => removeCartItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_KEYS.me });
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => clearCart(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_KEYS.me });
        },
    });
};

export const useCreateCartCheckoutSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCartCheckoutSessionRequest) => createCartCheckoutSession(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_KEYS.me });
        },
    });
};

export const useConfirmCartCheckoutSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ConfirmCartCheckoutSessionRequest) => confirmCartCheckoutSession(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_KEYS.me });
        },
    });
};
