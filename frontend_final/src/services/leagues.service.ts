import { fastapi } from "@/api/axios"
import type { ApiResponse, LeaguesResponse } from "@/types/leagues"

export const getLeagues = async () => {
    const res = await fastapi.get<ApiResponse<LeaguesResponse[]>>('/api/leagues')
    return res.data.data!
}

