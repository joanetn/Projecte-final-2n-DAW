<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckPermission
{
    /**
     * Verifica que el usuario tenga el permiso específico.
     *
     * Uso: middleware('checkPermission:admin.usuaris.delete')
     *
     * Requiere que checkRole haya sido ejecutado antes (establece admin_user_roles en request).
     */
    public function handle(Request $request, Closure $next, string ...$permissions): mixed
    {
        $userRoles = $request->input('admin_user_roles', []);

        if (empty($userRoles)) {
            return response()->json(
                ['success' => false, 'message' => 'No autenticado o sin roles'],
                401
            );
        }

        // Obtener permisos del usuario basándose en sus roles
        $userPermissions = DB::table('permissions')
            ->join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->whereIn('role_permissions.rol', $userRoles)
            ->pluck('permissions.name')
            ->toArray();

        $hasPermission = false;
        foreach ($permissions as $permission) {
            if (in_array($permission, $userPermissions)) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Permiso denegado. Requerido: ' . implode(' o ', $permissions),
                ],
                403
            );
        }

        return $next($request)
            ->header('X-User-Permissions', implode(',', $userPermissions));
    }
}
