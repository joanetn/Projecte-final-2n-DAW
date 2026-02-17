import { laravel } from "@/api/axios"
import type {
    Merch,
    MerchDetail,
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
} from "@/types/merch"

// ========== MERCHS ==========
export const getMerchs = async (params?: SearchMerchsParams): Promise<SearchMerchsResponse> => {
    const res = await laravel.get<SearchMerchsResponse>('/api/merchs', { params })
    return res.data
}

export const getOneMerch = async (id: string): Promise<Merch> => {
    const res = await laravel.get<ApiResponse<Merch>>(`/api/merchs/${id}`)
    return res.data.data!
}

export const createMerch = async (data: CreateMerchRequest): Promise<string> => {
    const res = await laravel.post<CreateMerchResponse>(`/api/merchs`, data)
    return res.data.data.id
}

export const updateMerch = async (id: string, data: UpdateMerchRequest): Promise<void> => {
    await laravel.put<ApiResponse<void>>(`/api/merchs/${id}`, data)
}

export const deleteMerch = async (id: string): Promise<void> => {
    await laravel.delete<ApiResponse<void>>(`/api/merchs/${id}`)
}

// ========== COMPRAS ==========
export const getCompras = async (): Promise<Compra[]> => {
    const res = await laravel.get<ApiListResponse<Compra>>('/api/compras')
    return res.data.data
}

export const getOneCompra = async (id: string): Promise<CompraDetail> => {
    const res = await laravel.get<ApiResponse<CompraDetail>>(`/api/compras/${id}`)
    return res.data.data!
}

export const getComprasByUsuari = async (usuariId: string): Promise<Compra[]> => {
    const res = await laravel.get<ApiListResponse<Compra>>(`/api/usuaris/${usuariId}/compras`)
    return res.data.data
}

export const getComprasByMerch = async (merchId: string): Promise<Compra[]> => {
    const res = await laravel.get<ApiListResponse<Compra>>(`/api/merchs/${merchId}/compras`)
    return res.data.data
}

export const createCompra = async (data: CreateCompraRequest): Promise<string> => {
    const res = await laravel.post<CreateCompraResponse>(`/api/compras`, data)
    return res.data.data.id
}

export const updateCompra = async (id: string, data: UpdateCompraRequest): Promise<void> => {
    await laravel.put<ApiResponse<void>>(`/api/compras/${id}`, data)
}

export const deleteCompra = async (id: string): Promise<void> => {
    await laravel.delete<ApiResponse<void>>(`/api/compras/${id}`)
}