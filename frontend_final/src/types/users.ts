// ========== USUARIO BASE ==========
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

// ========== USUARIO CON RELACIONES ==========
export interface UserDetail extends User {
    rols?: UserRole[];
    equipUsuaris?: any[];
    compras?: any[];
    seguros?: any[];
}

// ========== CREAR USUARIO ==========
export interface CreateUserRequest {
    nom: string;
    email: string;
    contrasenya: string;
    telefon?: string;
    dataNaixement?: string;
    avatar?: string;
    dni?: string;
}

// ========== ACTUALIZAR USUARIO ==========
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

// ========== REGISTRO (PARA AUTH) ==========
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

// ========== ROLES ==========
export interface UserRole {
    id: string;
    usuariId: string;
    rol: string;
    isActive: boolean;
    createdAt?: string;
}

// ========== CREAR/ACTUALIZAR ROL ==========
export interface CreateRoleRequest {
    rol: string;
}

export interface UpdateRoleRequest {
    isActive: boolean;
}

// ========== BULK ROLES ==========
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

// ========== RESPUESTAS GENÉRICAS ==========
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