import { fastapi } from "@/api/axios"
import type { LeaguesResponse } from "@/types/leagues"

type FastApiResponse<T> = {
    status: 'success' | 'error' | 'validation_error'
    message?: string
    data?: T
    errors?: unknown
}

export const getLeagues = async () => {
    const res = await fastapi.get<FastApiResponse<LeaguesResponse[]>>('/api/leagues')
    return res.data.data ?? []
}

