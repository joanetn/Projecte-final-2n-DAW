import { laravel } from "@/api/axios"
import { authHeader } from '@/services/shared/auth-header'
import { extractArray } from '@/services/shared/response-utils'
import type { ProfileSessionsData } from "@/types/profile"

export const sessions = async (): Promise<ProfileSessionsData[]> => {
    const res = await laravel.get('/api/auth/sessions', { headers: authHeader() })
    return extractArray<ProfileSessionsData>(res.data, ['sessions'])
}