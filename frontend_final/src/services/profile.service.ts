import { laravel } from "@/api/axios"
import type { ProfileSessionsData } from "@/types/profile"

export const sessions = async () => {
    const res = await laravel.get<ProfileSessionsData[]>("/auth/sessions")
    return res.data
}