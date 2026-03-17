import { useAuth } from '@/context/AuthContext';
import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

// ─── RolGuard ────────────────────────────────────────────────────────────────

interface RolGuardProps {
    children: JSX.Element;
    allowedRoles: string[];
    requiredPermissions?: string[];
    requireAll?: boolean;
}

/**
 * Protege rutas verificando roles (y opcionalmente permisos) del usuario.
 *
 * @param allowedRoles        - Al menos uno de estos roles debe tener el usuario
 * @param requiredPermissions - Permisos adicionales requeridos
 * @param requireAll          - Si true exige TODOS los permisos; si false exige AL MENOS UNO
 */
export const RolGuard = ({
    children,
    allowedRoles,
    requiredPermissions,
    requireAll = true,
}: RolGuardProps) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    const userRoles = user.rols ?? [];
    const hasRole = userRoles.some(r => allowedRoles.includes(r.rol));
    if (!hasRole) return <Navigate to="/" replace />;

    if (requiredPermissions && requiredPermissions.length > 0) {
        const userPermissions = user.permisos ?? [];
        const hasPermission = requireAll
            ? requiredPermissions.every(p => userPermissions.includes(p))
            : requiredPermissions.some(p => userPermissions.includes(p));

        if (!hasPermission) return <Navigate to="/" replace />;
    }

    return children;
};

// ─── PermissionGuard ─────────────────────────────────────────────────────────

interface PermissionGuardProps {
    children: JSX.Element;
    permission: string | string[];
    fallback?: JSX.Element | null;
    requireAll?: boolean;
}

/**
 * Protege componentes verificando permisos específicos.
 * Si el usuario no tiene el permiso, renderiza `fallback` (por defecto null).
 *
 * Ejemplos:
 *   <PermissionGuard permission="admin.usuaris.delete">
 *     <Button>Eliminar</Button>
 *   </PermissionGuard>
 *
 *   <PermissionGuard permission={["admin.equips.create", "admin.equips.edit"]} requireAll>
 *     <Form />
 *   </PermissionGuard>
 */
export const PermissionGuard = ({
    children,
    permission,
    fallback = null,
    requireAll = false,
}: PermissionGuardProps) => {
    const { user } = useAuth();

    if (!user) return fallback;

    const userPermissions = user.permisos ?? [];
    const permissions = Array.isArray(permission) ? permission : [permission];

    const hasPermission = requireAll
        ? permissions.every(p => userPermissions.includes(p))
        : permissions.some(p => userPermissions.includes(p));

    return hasPermission ? children : fallback;
};
