import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getPermisos,
    getUsuarispermissoes,
    getPermisosUsuari,
    updatePermisosUsuari as updatePermisosUsuariService,
    assignAllPermissions as assignAllPermissionsService,
    clearDirectPermissions as clearDirectPermissionsService,
} from '@/services/permissions.service'
import type { Permission, UsuariPermiso, UsuariPermisosDetalle } from '@/types/permissions'

// Query keys
const PERMISSIONS_KEYS = {
    all: ['permissions'] as const,
    permisos: () => [...PERMISSIONS_KEYS.all, 'permisos'] as const,
    usuaris: () => [...PERMISSIONS_KEYS.all, 'usuaris'] as const,
    usuariDetail: (usuariId: string) => [...PERMISSIONS_KEYS.usuaris(), usuariId] as const,
}

// Queries
export const useGetPermisos = () =>
    useQuery<Permission[]>({
        queryKey: PERMISSIONS_KEYS.permisos(),
        queryFn: getPermisos,
    })

export const useGetUsuarisPermisos = () =>
    useQuery<UsuariPermiso[]>({
        queryKey: PERMISSIONS_KEYS.usuaris(),
        queryFn: getUsuarispermissoes,
    })

export const useGetPermisosUsuari = (usuariId: string) =>
    useQuery<UsuariPermisosDetalle>({
        queryKey: PERMISSIONS_KEYS.usuariDetail(usuariId),
        queryFn: () => getPermisosUsuari(usuariId),
        enabled: !!usuariId,
    })

// Mutations
export const useUpdatePermisosUsuari = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ usuariId, permisosIds }: { usuariId: string; permisosIds: string[] }) =>
            updatePermisosUsuariService(usuariId, permisosIds),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: PERMISSIONS_KEYS.usuaris(),
            })
            queryClient.invalidateQueries({
                queryKey: PERMISSIONS_KEYS.usuariDetail(data.usuariId),
            })
        },
    })
}

export const useAssignAllPermissions = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (usuariId: string) => assignAllPermissionsService(usuariId),
        onSuccess: (_, usuariId) => {
            queryClient.invalidateQueries({
                queryKey: PERMISSIONS_KEYS.usuaris(),
            })
            queryClient.invalidateQueries({
                queryKey: PERMISSIONS_KEYS.usuariDetail(usuariId),
            })
        },
    })
}

export const useClearDirectPermissions = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (usuariId: string) => clearDirectPermissionsService(usuariId),
        onSuccess: (_, usuariId) => {
            queryClient.invalidateQueries({
                queryKey: PERMISSIONS_KEYS.usuaris(),
            })
            queryClient.invalidateQueries({
                queryKey: PERMISSIONS_KEYS.usuariDetail(usuariId),
            })
        },
    })
}
