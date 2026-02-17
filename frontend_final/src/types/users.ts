export interface User {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    dataNaixement?: string;
    nivell?: string;
    avatar?: string;
    dni?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserDetail extends User {
    rols?: UserRole[];
    equipUsuaris?: any[];
    compras?: any[];
    seguros?: any[];
}

export interface CreateUserRequest {
    nom: string;
    email: string;
    contrasenya: string;
    telefon?: string;
    dataNaixement?: string;
    avatar?: string;
    dni?: string;
    nivell?: string;
}

export interface UpdateUserRequest {
    nom?: string;
    email?: string;
    contrasenya?: string;
    telefon?: string;
    dataNaixement?: string;
    avatar?: string;
    dni?: string;
    isActive?: boolean;
    nivell?: string;
}

export interface RegisterData {
    nom: string;
    email: string;
    contrasenya: string;
    rol?: string[];
    telefon?: string;
    dni?: string;
    dataNaixement?: string;
    nivell?: string;
}

export interface UserRole {
    id: string;
    usuariId: string;
    rol: string;
    isActive: boolean;
    createdAt?: string;
}

export interface CreateRoleRequest {
    rol: string;
}

export interface UpdateRoleRequest {
    isActive: boolean;
}

export interface BulkRolesRequest {
    roles: string[];
}

export interface BulkRoleResult {
    action: 'created' | 'toggled';
    rolId: string;
    isActive: boolean;
}

export interface BulkRoleResultItem {
    rol: string;
    result?: BulkRoleResult;
    success: boolean;
    error?: string;
}

export interface BulkRolesResponse {
    usuariId: string;
    successful: number;
    failed: number;
    results: BulkRoleResultItem[];
    errors: any[];
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface CreateUserResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
    };
}

export interface RoleActionResponse {
    success: boolean;
    message: string;
    data?: {
        action: 'created' | 'toggled';
        rolId: string;
        isActive: boolean;
    };
}

// ========== BÚSQUEDA USUARIOS CON PAGINACIÓN ==========
export interface SearchUsersParams {
    q?: string;
    nivell?: string;
    sort?: 'nom_asc' | 'nom_desc' | 'created_at_asc' | 'created_at_desc';
    page?: number;
    limit?: number;
}

export interface SearchUsersResponse {
    success: boolean;
    data: User[];
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
}