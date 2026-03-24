export interface CartMerch {
    id: string;
    nom?: string;
    marca?: string;
    imageUrl?: string;
    preu?: number;
    stock?: number;
    isActive?: boolean;
}

export interface CartItem {
    id: string;
    cartId: string;
    merchId: string;
    quantitat: number;
    isActive: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
    subtotal?: number;
    merch?: CartMerch | null;
}

export interface Cart {
    id: string;
    usuariId: string;
    isActive: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
    totalItems: number;
    totalAmount: number;
    items: CartItem[];
}

export interface AddCartItemRequest {
    merchId: string;
    quantitat: number;
}

export interface UpdateCartItemQuantityRequest {
    quantitat: number;
}

export interface CreateCartCheckoutSessionRequest {
    successUrl: string;
    cancelUrl: string;
}

export interface ConfirmCartCheckoutSessionRequest {
    sessionId: string;
}

export interface CartCheckoutSession {
    sessionId: string;
    checkoutUrl: string;
}

export interface ApiCartResponse {
    success: boolean;
    message?: string;
    data?: Cart;
}

export interface ApiCartCheckoutSessionResponse {
    success: boolean;
    message?: string;
    data?: CartCheckoutSession;
}

export interface ApiCartCheckoutConfirmResponse {
    success: boolean;
    message?: string;
}
