import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
    getUsers,
    getUser,
    getUserDetail,
    searchAdminUsers,
    getAdminUser,
    getAdminUserDetail,
    getUserRoles,
} from '../services/user.service'
import type { User, UserDetail, UserRole, SearchUsersParams, SearchUsersResponse } from '../types/users'

export const useGetUsers = () =>
    useQuery<User[]>({
        queryKey: ['users', 'all'],
        queryFn: getUsers,
    })

export const useGetUser = (id: string | null) =>
    useQuery<User>({
        queryKey: ['users', id],
        queryFn: () => getUser(id!),
        enabled: !!id,
    })

export const useGetUserDetail = (id: string | null) =>
    useQuery<UserDetail>({
        queryKey: ['users', id, 'detail'],
        queryFn: () => getUserDetail(id!),
        enabled: !!id,
    })

export const useSearchAdminUsers = (params: SearchUsersParams) =>
    useQuery<SearchUsersResponse>({
        queryKey: ['admin', 'users', 'all', params],
        queryFn: () => searchAdminUsers(params),
        placeholderData: keepPreviousData,
    })

export const useGetAdminUser = (id: string | null) =>
    useQuery<User>({
        queryKey: ['admin', 'users', id],
        queryFn: () => getAdminUser(id!),
        enabled: !!id,
    })

export const useGetAdminUserDetail = (id: string | null) =>
    useQuery<UserDetail>({
        queryKey: ['admin', 'users', id, 'detail'],
        queryFn: () => getAdminUserDetail(id!),
        enabled: !!id,
    })

export const useGetUserRoles = (usuariId: string | null) =>
    useQuery<UserRole[]>({
        queryKey: ['admin', 'users', usuariId, 'roles'],
        queryFn: () => getUserRoles(usuariId!),
        enabled: !!usuariId,
    })
