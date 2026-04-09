<?php

namespace App\Modules\AdminWeb\Presentation\Http\Controllers;

use App\Models\Usuari;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminPermissionsController
{
    /**
     * Obtiene todos los usuarios con sus roles y permisos
     */
    public function llistarUsuarisPermisos(): JsonResponse
    {
        try {
            $usuaris = Usuari::all();

            $data = $usuaris->map(function ($usuari) {
                $permisosDirectos = DB::table('usuario_permissions')
                    ->join('permissions', 'usuario_permissions.permission_id', '=', 'permissions.id')
                    ->where('usuario_permissions.usuariId', $usuari->id)
                    ->pluck('permissions.id')
                    ->toArray();

                return [
                    'id' => $usuari->id,
                    'nom' => $usuari->nom,
                    'email' => $usuari->email,
                    'isActive' => $usuari->isActive,
                    'rols' => $usuari->getRolesArray(),
                    'permisosDirectos' => $permisosDirectos,
                    'todosLosPermisos' => $usuari->getPermissionsArray(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene todos los permisos disponibles en el sistema
     */
    public function llistarPermisos(): JsonResponse
    {
        try {
            $permisos = Permission::all(['id', 'name', 'description'])->toArray();

            return response()->json([
                'success' => true,
                'data' => $permisos,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener permisos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene los permisos de un usuario específico
     */
    public function obtenirPermisosUsuari(string $usuariId): JsonResponse
    {
        try {
            $usuari = Usuari::findOrFail($usuariId);

            $permisosDirectos = DB::table('usuario_permissions')
                ->join('permissions', 'usuario_permissions.permission_id', '=', 'permissions.id')
                ->where('usuario_permissions.usuariId', $usuariId)
                ->get(['permissions.id', 'permissions.name', 'permissions.description'])
                ->toArray();

            $todosLosPermisos = $usuari->getPermissionsArray();

            return response()->json([
                'success' => true,
                'data' => [
                    'usuariId' => $usuari->id,
                    'nom' => $usuari->nom,
                    'email' => $usuari->email,
                    'rols' => $usuari->getRolesArray(),
                    'permisosDirectos' => $permisosDirectos,
                    'todosLosPermisos' => $todosLosPermisos,
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener permisos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualiza los permisos directos de un usuario
     * 
     * Body: {
     *   "permisosIds": ["uuid1", "uuid2", ...]
     * }
     */
    public function actualizarPermisosUsuari(Request $request, string $usuariId): JsonResponse
    {
        try {
            $usuari = Usuari::findOrFail($usuariId);

            $validated = $request->validate([
                'permisosIds' => 'required|array',
                'permisosIds.*' => 'uuid|exists:permissions,id',
            ]);

            // Obtener los permisos actuales
            $permisosActuales = DB::table('usuario_permissions')
                ->where('usuariId', $usuariId)
                ->pluck('permission_id')
                ->toArray();

            $permisosNuevos = $validated['permisosIds'] ?? [];

            // Eliminar permisos que ya no están en la lista
            $permisosAEliminar = array_diff($permisosActuales, $permisosNuevos);
            if (!empty($permisosAEliminar)) {
                DB::table('usuario_permissions')
                    ->where('usuariId', $usuariId)
                    ->whereIn('permission_id', $permisosAEliminar)
                    ->delete();
            }

            // Agregar nuevos permisos
            $permisosAAgregar = array_diff($permisosNuevos, $permisosActuales);
            foreach ($permisosAAgregar as $permissionId) {
                DB::table('usuario_permissions')->insert([
                    'id' => Str::uuid()->toString(),
                    'usuariId' => $usuariId,
                    'permission_id' => $permissionId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Permisos actualizados correctamente',
                'data' => [
                    'usuariId' => $usuari->id,
                    'nom' => $usuari->nom,
                    'permisosActualizados' => $permisosNuevos,
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar permisos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Asigna todos los permisos a un usuario
     */
    public function asignarTodosLosPermisos(string $usuariId): JsonResponse
    {
        try {
            $usuari = Usuari::findOrFail($usuariId);

            $todosLosPermisos = Permission::all();
            $permisosIds = $todosLosPermisos->pluck('id')->toArray();

            // Usar el método anterior para actualizar
            $request = new Request(['permisosIds' => $permisosIds]);
            return $this->actualizarPermisosUsuari($request, $usuariId);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Elimina todos los permisos directos de un usuario (mantiene los de rol)
     */
    public function limpiarPermisosDirectos(string $usuariId): JsonResponse
    {
        try {
            $usuari = Usuari::findOrFail($usuariId);

            DB::table('usuario_permissions')
                ->where('usuariId', $usuariId)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Permisos directos eliminados',
                'data' => [
                    'usuariId' => $usuari->id,
                    'nom' => $usuari->nom,
                    'permisosRestantes' => $usuari->getPermissionsArray(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
