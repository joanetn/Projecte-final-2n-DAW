import { laravel } from '@/api/axios'
import { authHeader } from '@/services/shared/auth-header'
import { extractArray, unwrapApiData } from '@/services/shared/response-utils'
import type {
    User,
    UserDetail,
    CreateUserRequest,
    UpdateUserRequest,
    UserRole,
    CreateRoleRequest,
    UpdateRoleRequest,
    BulkRolesRequest,
    BulkRolesResponse,
    ApiResponse,
    CreateUserResponse,
    RoleActionResponse,
    SearchUsersParams,
    SearchUsersResponse,
} from '../types/users'

// ========== ENDPOINTS PÚBLICOS (solo usuarios activos, para login etc.) ==========
export const getUsers = async (): Promise<User[]> => {
    const res = await laravel.get<ApiResponse<User[]>>('/api/usuaris', { headers: authHeader() })
    return extractArray<User>(res.data)
}

export const getUser = async (id: string): Promise<User> => {
    const res = await laravel.get<ApiResponse<User>>(`/api/usuaris/${id}`, { headers: authHeader() })
    return unwrapApiData<User>(res.data)
}

export const getUserDetail = async (id: string): Promise<UserDetail> => {
    const res = await laravel.get<ApiResponse<UserDetail>>(`/api/usuaris/${id}/detail`, { headers: authHeader() })
    return unwrapApiData<UserDetail>(res.data)
}

export const getLevels = async (): Promise<string[]> => {
    const res = await laravel.get('/api/usuaris/nivells')
    return extractArray<string>(res.data)
}

// ========== ENDPOINTS ADMIN (todos los usuarios, incluidos inactivos) ==========
export const searchAdminUsers = async (params?: SearchUsersParams): Promise<SearchUsersResponse> => {
    const res = await laravel.get<SearchUsersResponse>('/api/admin/usuaris', { params, headers: authHeader() })
    return res.data
}

export const getAdminUser = async (id: string): Promise<User> => {
    const res = await laravel.get<ApiResponse<User>>(`/api/admin/usuaris/${id}`, { headers: authHeader() })
    return unwrapApiData<User>(res.data)
}

export const getAdminUserDetail = async (id: string): Promise<UserDetail> => {
    const res = await laravel.get<ApiResponse<UserDetail>>(`/api/admin/usuaris/${id}/detail`, { headers: authHeader() })
    return unwrapApiData<UserDetail>(res.data)
}

export const createUser = async (data: CreateUserRequest): Promise<string> => {
    const res = await laravel.post<CreateUserResponse>('/api/admin/usuaris', data, { headers: authHeader() })
    const payload = unwrapApiData<{ id: string }>(res.data)
    return payload.id
}

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<void> => {
    await laravel.put<ApiResponse<void>>(`/api/admin/usuaris/${id}`, data, { headers: authHeader() })
}

export const deleteUser = async (id: string): Promise<void> => {
    await laravel.delete<ApiResponse<void>>(`/api/admin/usuaris/${id}`, { headers: authHeader() })
}

// ========== ENDPOINTS DE ROLES (admin) ==========
export const getUserRoles = async (usuariId: string): Promise<UserRole[]> => {
    const res = await laravel.get<ApiResponse<UserRole[]>>(`/api/admin/usuaris/${usuariId}/rols`, { headers: authHeader() })
    return extractArray<UserRole>(res.data)
}

export const createUserRole = async (
    usuariId: string,
    data: CreateRoleRequest
): Promise<RoleActionResponse> => {
    const res = await laravel.post<RoleActionResponse>(
        `/api/admin/usuaris/${usuariId}/rols`,
        data,
        { headers: authHeader() }
    )
    return res.data
}

export const updateUserRole = async (
    usuariId: string,
    rolId: string,
    data: UpdateRoleRequest
): Promise<void> => {
    await laravel.put<ApiResponse<void>>(
        `/api/admin/usuaris/${usuariId}/rols/${rolId}`,
        data,
        { headers: authHeader() }
    )
}

export const deleteUserRole = async (usuariId: string, rolId: string): Promise<void> => {
    await laravel.delete<ApiResponse<void>>(`/api/admin/usuaris/${usuariId}/rols/${rolId}`, { headers: authHeader() })
}

export const bulkUpdateUserRoles = async (
    usuariId: string,
    data: BulkRolesRequest
): Promise<BulkRolesResponse> => {
    const res = await laravel.post<ApiResponse<BulkRolesResponse>>(
        `/api/admin/usuaris/${usuariId}/rols/bulk`,
        data,
        { headers: authHeader() }
    )
    return unwrapApiData<BulkRolesResponse>(res.data)
}