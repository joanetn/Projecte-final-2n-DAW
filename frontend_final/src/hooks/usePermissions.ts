import { useAuth } from '@/context/AuthContext';

interface UsePermissionsReturn {
    can: (permission: string) => boolean;
    canAll: (permissions: string[]) => boolean;
    canAny: (permissions: string[]) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasAllRoles: (roles: string[]) => boolean;
    userPermissions: string[];
    userRoles: string[];
}

/**
 * Hook para verificar roles y permisos del usuario autenticado.
 *
 * Ejemplos:
 *   const { can, hasRole } = usePermissions();
 *   const canDelete = can('admin.usuaris.delete');
 *   const isAdmin   = hasRole('ADMIN_WEB');
 */
export const usePermissions = (): UsePermissionsReturn => {
    const { user } = useAuth();

    const userPermissions = user?.permisos ?? [];
    const userRoles = (user?.rols ?? []).map(r => r.rol);

    return {
        can: (permission) => userPermissions.includes(permission),
        canAll: (permissions) => permissions.every(p => userPermissions.includes(p)),
        canAny: (permissions) => permissions.some(p => userPermissions.includes(p)),
        hasRole: (role) => userRoles.includes(role),
        hasAnyRole: (roles) => roles.some(r => userRoles.includes(r)),
        hasAllRoles: (roles) => roles.every(r => userRoles.includes(r)),
        userPermissions,
        userRoles,
    };
};
