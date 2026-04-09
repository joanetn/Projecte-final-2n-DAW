import { laravel } from '@/api/axios'
import { authHeader } from '@/services/shared/auth-header'
import { extractArray, unwrapApiData } from '@/services/shared/response-utils'
import { type Permission, type UsuariPermiso, type UsuariPermisosDetalle } from '@/types/permissions'

// Obtener todos los permisos del sistema
export const getPermisos = async (): Promise<Permission[]> => {
    const res = await laravel.get<{ success: boolean; data: Permission[] }>(
        '/api/admin-web/permisos',
        { headers: authHeader() }
    )
    return extractArray<Permission>(res.data)
}

// Obtener todos los usuarios con sus permisos
export const getUsuarispermissoes = async (): Promise<UsuariPermiso[]> => {
    const res = await laravel.get<{ success: boolean; data: UsuariPermiso[] }>(
        '/api/admin-web/usuaris-permisos',
        { headers: authHeader() }
    )
    return extractArray<UsuariPermiso>(res.data)
}

// Obtener permisos de un usuario específico
export const getPermisosUsuari = async (usuariId: string): Promise<UsuariPermisosDetalle> => {
    const res = await laravel.get<{ success: boolean; data: UsuariPermisosDetalle }>(
        `/api/admin-web/usuaris/${usuariId}/permisos`,
        { headers: authHeader() }
    )
    return unwrapApiData<UsuariPermisosDetalle>(res.data)
}

// Actualizar permisos de un usuario
export const updatePermisosUsuari = async (
    usuariId: string,
    permisosIds: string[]
): Promise<{ usuariId: string; nom: string; permisosActualizados: string[] }> => {
    const res = await laravel.patch<{
        success: boolean
        data: { usuariId: string; nom: string; permisosActualizados: string[] }
    }>(`/api/admin-web/usuaris/${usuariId}/permisos`, {
        permisosIds,
    }, {
        headers: authHeader(),
    })
    return unwrapApiData<{ usuariId: string; nom: string; permisosActualizados: string[] }>(res.data)
}

// Asignar todos los permisos a un usuario
export const assignAllPermissions = async (usuariId: string) => {
    const res = await laravel.post<{ success: boolean; data: unknown }>(
        `/api/admin-web/usuaris/${usuariId}/permisos/todos`,
        undefined,
        { headers: authHeader() }
    )
    return unwrapApiData<unknown>(res.data)
}

// Limpiar permisos directos de un usuario
export const clearDirectPermissions = async (usuariId: string) => {
    const res = await laravel.delete<{ success: boolean; data: unknown }>(
        `/api/admin-web/usuaris/${usuariId}/permisos`,
        { headers: authHeader() }
    )
    return unwrapApiData<unknown>(res.data)
}
