import { fastapi } from "@/api/axios"

export const getLeagues = async () => {
    const res = await fastapi.get('/api/leagues')
    return res.data
}

