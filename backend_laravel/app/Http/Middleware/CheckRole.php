<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Usuari;

class CheckRole
{
    /**
     * Verifica que el usuario autenticado tenga al menos uno de los roles requeridos.
     *
     * Uso: middleware('checkRole:ADMIN_WEB')
     *      middleware('checkRole:ADMIN_WEB,ARBITRE')
     *
     * Requiere que jwt.auth haya sido ejecutado antes (establece auth_user_id en request).
     */
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        $userId = $request->input('auth_user_id');

        if (!$userId) {
            return response()->json(
                ['success' => false, 'message' => 'No autenticado'],
                401
            );
        }

        $user = Usuari::with([
            'rols' => fn($q) => $q->where('isActive', true),
        ])->find($userId);

        if (!$user) {
            return response()->json(
                ['success' => false, 'message' => 'Usuario no encontrado'],
                401
            );
        }

        if (!$user->isActive) {
            return response()->json(
                ['success' => false, 'message' => 'Usuario inactivo'],
                403
            );
        }

        $userRoles = $user->rols->pluck('rol')->toArray();

        $hasRole = false;
        foreach ($roles as $role) {
            if (in_array($role, $userRoles)) {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Acceso denegado. Rol requerido: ' . implode(' o ', $roles),
                ],
                403
            );
        }

        // Poner el usuario cargado en la request para los siguientes middlewares/controllers
        $request->merge(['admin_user' => $user, 'admin_user_roles' => $userRoles]);

        return $next($request)
            ->header('X-User-Roles', implode(',', $userRoles))
            ->header('X-User-Permissions', implode(',', $user->getPermissionsArray()));
    }
}
