import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createUser,
    updateUser,
    deleteUser,
    createUserRole,
    updateUserRole,
    deleteUserRole,
    bulkUpdateUserRoles,
} from '../services/user.service'
import type {
    CreateUserRequest,
    UpdateUserRequest,
    CreateRoleRequest,
    UpdateRoleRequest,
    BulkRolesRequest,
} from '../types/users'

export const useCreateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateUserRequest) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'all'] })
        },
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
            updateUser(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', id] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', id, 'detail'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'all'] })
        },
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'all'] })
        },
    })
}

export const useCreateUserRole = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ usuariId, data }: { usuariId: string; data: CreateRoleRequest }) =>
            createUserRole(usuariId, data),
        onSuccess: (_, { usuariId }) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId, 'roles'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId, 'detail'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId] })
        },
    })
}

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            usuariId,
            rolId,
            data,
        }: {
            usuariId: string
            rolId: string
            data: UpdateRoleRequest
        }) => updateUserRole(usuariId, rolId, data),
        onSuccess: (_, { usuariId }) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId, 'roles'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId, 'detail'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId] })
        },
    })
}

export const useDeleteUserRole = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ usuariId, rolId }: { usuariId: string; rolId: string }) =>
            deleteUserRole(usuariId, rolId),
        onSuccess: (_, { usuariId }) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId, 'roles'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId, 'detail'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId] })
        },
    })
}

export const useBulkUpdateUserRoles = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ usuariId, data }: { usuariId: string; data: BulkRolesRequest }) =>
            bulkUpdateUserRoles(usuariId, data),
        onSuccess: (_, { usuariId }) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId, 'roles'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId, 'detail'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', usuariId] })
        },
    })
}
