// ========== BRAND ==========
export interface Brand {
    value: string;
    label: string;
}

// ========== MERCH BASE ==========
export interface Merch {
    id: string;
    nom: string;
    marca?: string;
    imageUrl?: string;
    preu?: number;
    stock?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ========== MERCH CON RELACIONES ==========
export interface MerchDetail extends Merch {
    compras?: Compra[];
}

// ========== CREAR MERCH ==========
export interface CreateMerchRequest {
    nom: string;
    marca?: string;
    imageUrl?: string;
    preu?: number;
    stock?: number;
}

// ========== ACTUALIZAR MERCH ==========
export interface UpdateMerchRequest {
    nom?: string;
    marca?: string;
    imageUrl?: string;
    preu?: number;
    stock?: number;
    isActive?: boolean;
}

// ========== RESPUESTA CREATE MERCH ==========
export interface CreateMerchResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
    };
}

// ========== COMPRA BASE ==========
export interface Compra {
    id: string;
    usuariId: string;
    merchId: string;
    quantitat: number;
    total: number;
    pagat: boolean;
    status?: string;
    isActive: boolean;
    createdAt?: string;
}

// ========== COMPRA CON RELACIONES ==========
export interface CompraDetail extends Compra {
    usuari?: {
        id: string;
        nom: string;
        email: string;
    };
    merch?: {
        id: string;
        nom: string;
        preu: number;
    };
}

// ========== CREAR COMPRA ==========
export interface CreateCompraRequest {
    usuariId: string;
    merchId: string;
    quantitat: number;
    total?: number;
}

// ========== ACTUALIZAR COMPRA ==========
export interface UpdateCompraRequest {
    quantitat?: number;
    total?: number;
    pagat?: boolean;
    status?: string;
    isActive?: boolean;
}

// ========== RESPUESTA CREATE COMPRA ==========
export interface CreateCompraResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
    };
}

// ========== BÚSQUEDA MERCHS CON PAGINACIÓN ==========
export interface SearchMerchsResponse {
    success: boolean;
    data: Merch[];
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
}

// ========== BÚSQUEDA PARÁMETROS ==========
export interface SearchMerchsParams {
    q?: string;
    marca?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'id' | 'preu_asc' | 'preu_desc';
    page?: number;
    limit?: number;
}

// ========== RESPUESTA GENÉRICA API ==========
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// ========== RESPUESTA LISTADO ==========
export interface ApiListResponse<T> {
    success: boolean;
    data: T[];
}
