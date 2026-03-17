<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PermissionsSeeder extends Seeder
{
    /**
     * Crea todos los permisos del sistema y los asigna al rol ADMIN_WEB.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'admin.estadistiques',    'description' => 'Ver estadísticas del sistema'],
            ['name' => 'admin.usuaris.view',     'description' => 'Ver listado de usuarios'],
            ['name' => 'admin.usuaris.edit',     'description' => 'Editar roles de usuarios'],
            ['name' => 'admin.usuaris.toggle',   'description' => 'Activar/desactivar usuarios'],
            ['name' => 'admin.usuaris.delete',   'description' => 'Eliminar usuarios'],
            ['name' => 'admin.equips.create',    'description' => 'Crear equipos'],
            ['name' => 'admin.equips.edit',      'description' => 'Editar equipos'],
            ['name' => 'admin.equips.delete',    'description' => 'Eliminar equipos'],
            ['name' => 'admin.lligues.create',   'description' => 'Crear ligas'],
            ['name' => 'admin.lligues.edit',     'description' => 'Editar ligas'],
            ['name' => 'admin.lligues.delete',   'description' => 'Eliminar ligas'],
            ['name' => 'admin.partits.create',   'description' => 'Crear partidos'],
            ['name' => 'admin.partits.edit',     'description' => 'Editar partidos'],
            ['name' => 'admin.partits.delete',   'description' => 'Eliminar partidos'],
            ['name' => 'admin.arbitres.assign',  'description' => 'Asignar árbitros a partidos'],
            ['name' => 'admin.classificacio.view', 'description' => 'Ver clasificaciones'],
        ];

        foreach ($permissions as $perm) {
            $existing = DB::table('permissions')->where('name', $perm['name'])->first();

            if (!$existing) {
                $id = (string) Str::uuid();
                DB::table('permissions')->insert([
                    'id'          => $id,
                    'name'        => $perm['name'],
                    'description' => $perm['description'],
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                // Asignar al rol ADMIN_WEB
                DB::table('role_permissions')->insertOrIgnore([
                    'rol'           => 'ADMIN_WEB',
                    'permission_id' => $id,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);
            }
        }

        $this->command->info('✅ Permisos creados y asignados al rol ADMIN_WEB');
    }
}
