import { useQuery } from '@tanstack/react-query';
import { getMyCart } from '@/services/cart.service';
import type { Cart } from '@/types/cart';

export const CART_KEYS = {
    me: ['cart', 'me'] as const,
};

export const useGetMyCart = (enabled = true) =>
    useQuery<Cart>({
        queryKey: CART_KEYS.me,
        queryFn: getMyCart,
        enabled,
    });
