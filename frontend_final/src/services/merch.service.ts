import { laravel } from "@/api/axios"
import type {
    Merch,
    CreateMerchRequest,
    UpdateMerchRequest,
    CreateMerchResponse,
    Compra,
    CompraDetail,
    CreateCompraRequest,
    UpdateCompraRequest,
    CreateCompraResponse,
    SearchMerchsResponse,
    SearchMerchsParams,
    ApiResponse,
    ApiListResponse,
    Brand,
} from "@/types/merch"

const authHeader = () => {
    const token = localStorage.getItem('accessToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

// ========== MERCHS ==========
export const getMerchs = async (params?: SearchMerchsParams): Promise<SearchMerchsResponse> => {
    const res = await laravel.get<SearchMerchsResponse>('/api/merchs', { params, headers: authHeader() })
    return res.data
}

export const getBrands = async (): Promise<Brand[]> => {
    const res = await laravel.get<{ success: boolean; data: Brand[] }>('/api/merchs/brands', { headers: authHeader() })
    return res.data.data
}

export const getOneMerch = async (id: string): Promise<Merch> => {
    const res = await laravel.get<ApiResponse<Merch>>(`/api/merchs/${id}`, { headers: authHeader() })
    return res.data.data!
}

export const createMerch = async (data: CreateMerchRequest): Promise<string> => {
    const res = await laravel.post<CreateMerchResponse>(`/api/merchs`, data, { headers: authHeader() })
    return res.data.data.id
}

export const updateMerch = async (id: string, data: UpdateMerchRequest): Promise<void> => {
    await laravel.put<ApiResponse<void>>(`/api/merchs/${id}`, data, { headers: authHeader() })
}

export const deleteMerch = async (id: string): Promise<void> => {
    await laravel.delete<ApiResponse<void>>(`/api/merchs/${id}`, { headers: authHeader() })
}

// ========== COMPRAS ==========
export const getCompras = async (): Promise<Compra[]> => {
    const res = await laravel.get<ApiListResponse<Compra>>('/api/compras', { headers: authHeader() })
    return res.data.data
}

export const getOneCompra = async (id: string): Promise<CompraDetail> => {
    const res = await laravel.get<ApiResponse<CompraDetail>>(`/api/compras/${id}`, { headers: authHeader() })
    return res.data.data!
}

export const getComprasByUsuari = async (usuariId: string): Promise<Compra[]> => {
    const res = await laravel.get<ApiListResponse<Compra>>(`/api/compras/usuari/${usuariId}`, { headers: authHeader() })
    return res.data.data
}

export const getComprasByMerch = async (merchId: string): Promise<Compra[]> => {
    const res = await laravel.get<ApiListResponse<Compra>>(`/api/compras/merch/${merchId}`, { headers: authHeader() })
    return res.data.data
}

export const createCompra = async (data: CreateCompraRequest): Promise<string> => {
    const res = await laravel.post<CreateCompraResponse>(`/api/compras`, data, { headers: authHeader() })
    return res.data.data.id
}

export const updateCompra = async (id: string, data: UpdateCompraRequest): Promise<void> => {
    await laravel.put<ApiResponse<void>>(`/api/compras/${id}`, data, { headers: authHeader() })
}

export const deleteCompra = async (id: string): Promise<void> => {
    await laravel.delete<ApiResponse<void>>(`/api/compras/${id}`, { headers: authHeader() })
}
