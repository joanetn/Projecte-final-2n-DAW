import { fastapi, laravel } from "@/api/axios"
import { normalizeLeaguesAdminCollection } from '@/services/mappers/leagues.mapper'
import { authHeader } from '@/services/shared/auth-header'
import { extractArray, unwrapApiData } from '@/services/shared/response-utils'
import type { ApiResponse, ApiResponseWithoutData, CreateLeagueData, CreateLeagueResponse, FastApiResponse, LeagueCategory, LeaguesAdminResponse, LeaguesDetailAdminResponse, LeaguesDetailResponse, LeaguesResponse, UpdateLeagueData } from "@/types/leagues"

export const getLeagues = async (): Promise<LeaguesResponse[]> => {
    const res = await fastapi.get<FastApiResponse<LeaguesResponse[]>>('/api/leagues')
    return extractArray<LeaguesResponse>(res.data)
}

export const getLeague = async (id: string): Promise<LeaguesResponse> => {
    const res = await laravel.get<ApiResponse<LeaguesResponse>>(`/api/lligues/${id}`, { headers: authHeader() })
    return unwrapApiData<LeaguesResponse>(res.data)
}

export const getLeagueDetail = async (id: string): Promise<LeaguesDetailResponse> => {
    const res = await laravel.get<ApiResponse<LeaguesDetailResponse>>(`/api/lligues/${id}/detail`, { headers: authHeader() })
    return unwrapApiData<LeaguesDetailResponse>(res.data)
}

export const getLeaguesAdmin = async (): Promise<{ lligues: LeaguesAdminResponse[]; total: number }> => {
    const res = await laravel.get<ApiResponse<LeaguesAdminResponse[] | { lligues?: LeaguesAdminResponse[]; total?: number }>>('/api/admin-web/lligues', { headers: authHeader() })
    const payload = unwrapApiData<unknown>(res.data)
    return normalizeLeaguesAdminCollection(payload)
}

export const createLeague = async (payload: CreateLeagueData): Promise<CreateLeagueResponse> => {
    const res = await laravel.post<ApiResponse<CreateLeagueResponse>>('/api/lligues', payload, { headers: authHeader() })
    return unwrapApiData<CreateLeagueResponse>(res.data)
}

export const updateLeague = async (id: string, payload: UpdateLeagueData) => {
    const res = await laravel.patch<ApiResponseWithoutData>(`/api/admin-web/lligues/${id}`, payload, { headers: authHeader() })
    return res.data
}

export const getLeagueAdmin = async (id: string): Promise<LeaguesAdminResponse> => {
    const res = await laravel.get<ApiResponse<LeaguesAdminResponse>>(`/api/admin-web/lligues/${id}`, { headers: authHeader() })
    return unwrapApiData<LeaguesAdminResponse>(res.data)
}

export const getLeagueDetailAdmin = async (id: string): Promise<LeaguesDetailAdminResponse> => {
    const res = await laravel.get<ApiResponse<LeaguesDetailAdminResponse>>(`/api/admin-web/lligues/${id}/detail`, { headers: authHeader() })
    return unwrapApiData<LeaguesDetailAdminResponse>(res.data)
}

export const deleteLeagueAdmin = async (id: string) => {
    const res = await laravel.delete<ApiResponseWithoutData>(`/api/admin-web/lligues/${id}`, { headers: authHeader() })
    return res.data
}

export const getCategories = async () => {
    const res = await laravel.get<LeagueCategory[]>('/api/lligues/categories', { headers: authHeader() })
    return extractArray<LeagueCategory>(res.data)
}

export const generateLeagueFixtures = async (lligaId: string, force = false) => {
    const res = await laravel.post<ApiResponseWithoutData>(`/api/admin-web/lligues/${lligaId}/generar-partits`, { force }, { headers: authHeader() })
    return res.data
}
