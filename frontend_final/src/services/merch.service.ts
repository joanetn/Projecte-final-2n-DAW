import { laravel } from "@/api/axios"

export const getMerch = async () => {
    const res = await laravel.get('/api/merchs')
    console.log(res.data)
}