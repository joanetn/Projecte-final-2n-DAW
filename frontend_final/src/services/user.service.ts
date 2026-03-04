import { laravel } from '@/api/axios'
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
    const res = await laravel.get<ApiResponse<User[]>>('/api/usuaris')
    return res.data.data || []
}

export const getUser = async (id: string): Promise<User> => {
    const res = await laravel.get<ApiResponse<User>>(`/api/usuaris/${id}`)
    return res.data.data!
}

export const getUserDetail = async (id: string): Promise<UserDetail> => {
    const res = await laravel.get<ApiResponse<UserDetail>>(`/api/usuaris/${id}/detail`)
    return res.data.data!
}

export const getLevels = async () => {
    const res = await laravel.get('/api/usuaris/nivells')
    return res.data.data!
}

// ========== ENDPOINTS ADMIN (todos los usuarios, incluidos inactivos) ==========
export const searchAdminUsers = async (params?: SearchUsersParams): Promise<SearchUsersResponse> => {
    const res = await laravel.get<SearchUsersResponse>('/api/admin/usuaris', { params })
    return res.data
}

export const getAdminUser = async (id: string): Promise<User> => {
    const res = await laravel.get<ApiResponse<User>>(`/api/admin/usuaris/${id}`)
    return res.data.data!
}

export const getAdminUserDetail = async (id: string): Promise<UserDetail> => {
    const res = await laravel.get<ApiResponse<UserDetail>>(`/api/admin/usuaris/${id}/detail`)
    console.log(res.data.data!)
    return res.data.data!
}

export const createUser = async (data: CreateUserRequest): Promise<string> => {
    const res = await laravel.post<CreateUserResponse>('/api/admin/usuaris', data)
    return res.data.data.id
}

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<void> => {
    await laravel.put<ApiResponse<void>>(`/api/admin/usuaris/${id}`, data)
}

export const deleteUser = async (id: string): Promise<void> => {
    await laravel.delete<ApiResponse<void>>(`/api/admin/usuaris/${id}`)
}

// ========== ENDPOINTS DE ROLES (admin) ==========
export const getUserRoles = async (usuariId: string): Promise<UserRole[]> => {
    const res = await laravel.get<ApiResponse<UserRole[]>>(`/api/admin/usuaris/${usuariId}/rols`)
    return res.data.data || []
}

export const createUserRole = async (
    usuariId: string,
    data: CreateRoleRequest
): Promise<RoleActionResponse> => {
    const res = await laravel.post<RoleActionResponse>(
        `/api/admin/usuaris/${usuariId}/rols`,
        data
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
        data
    )
}

export const deleteUserRole = async (usuariId: string, rolId: string): Promise<void> => {
    await laravel.delete<ApiResponse<void>>(`/api/admin/usuaris/${usuariId}/rols/${rolId}`)
}

export const bulkUpdateUserRoles = async (
    usuariId: string,
    data: BulkRolesRequest
): Promise<BulkRolesResponse> => {
    const res = await laravel.post<ApiResponse<BulkRolesResponse>>(
        `/api/admin/usuaris/${usuariId}/rols/bulk`,
        data
    )
    return res.data.data!
}