import { laravel } from '../api/axios'

export const getUsers = async (): Promise<any[]> => {
    const res = await laravel.get('/api/usuaris')
    return res.data.data
}