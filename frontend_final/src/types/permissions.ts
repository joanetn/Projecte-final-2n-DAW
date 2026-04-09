export interface Permission {
    id: string;
    name: string;
    description: string;
}

export interface UsuariPermiso {
    id: string
    nom: string
    email: string
    isActive: boolean
    rols: string[]
    permisosDirectos: string[]
    todosLosPermisos: string[]
}

export interface UsuariPermisosDetalle {
    usuariId: string
    nom: string
    email: string
    rols: string[]
    permisosDirectos: Permission[]
    todosLosPermisos: string[]
}

export interface PermissionCheck {
    permission: string;
    has: boolean;
}

export const AdminPermissions = {
    ESTADISTIQUES: 'admin.estadistiques',
    USUARIS_VIEW: 'admin.usuaris.view',
    USUARIS_EDIT: 'admin.usuaris.edit',
    USUARIS_TOGGLE: 'admin.usuaris.toggle',
    USUARIS_DELETE: 'admin.usuaris.delete',
    EQUIPS_CREATE: 'admin.equips.create',
    EQUIPS_EDIT: 'admin.equips.edit',
    EQUIPS_DELETE: 'admin.equips.delete',
    LLIGUES_CREATE: 'admin.lligues.create',
    LLIGUES_EDIT: 'admin.lligues.edit',
    LLIGUES_DELETE: 'admin.lligues.delete',
    PARTITS_CREATE: 'admin.partits.create',
    PARTITS_EDIT: 'admin.partits.edit',
    PARTITS_DELETE: 'admin.partits.delete',
    ARBITRES_ASSIGN: 'admin.arbitres.assign',
    CLASSIFICACIO_VIEW: 'admin.classificacio.view',
} as const

export type AdminPermission = typeof AdminPermissions[keyof typeof AdminPermissions]
