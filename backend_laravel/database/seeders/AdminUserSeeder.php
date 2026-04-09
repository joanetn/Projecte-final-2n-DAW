<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = 'admin@example.com';

        $existing = DB::table('usuaris')->where('email', $email)->first();

        if ($existing) {
            $userId = $existing->id;
            $this->command->info("Usuario ya existe: {$email}");
        } else {
            $userId = Str::uuid()->toString();

            DB::table('usuaris')->insert([
                'id' => $userId,
                'nom' => 'Admin Web',
                'email' => $email,
                'contrasenya' => bcrypt('SuperSecret123!'),
                'telefon' => null,
                'dataNaixement' => '1990-01-01',
                'nivell' => \App\Enums\UserLevel::AVANCAT->value,
                'avatar' => null,
                'dni' => null,
                'isActive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info("Usuario creado: {$email}");
        }

        $roleExists = DB::table('usuari_rols')
            ->where('usuariId', $userId)
            ->where('rol', 'ADMIN_WEB')
            ->first();

        if ($roleExists) {
            $this->command->info('Rol ADMIN_WEB ya asignado');
        } else {
            DB::table('usuari_rols')->insert([
                'id' => Str::uuid()->toString(),
                'usuariId' => $userId,
                'rol' => 'ADMIN_WEB',
                'isActive' => true,
                'createdAt' => now(),
            ]);

            $this->command->info('Rol ADMIN_WEB asignado');
        }

        // Asignar todos los permisos directamente al usuario admin
        $permissions = DB::table('permissions')->get();

        foreach ($permissions as $permission) {
            $alreadyHas = DB::table('usuario_permissions')
                ->where('usuariId', $userId)
                ->where('permission_id', $permission->id)
                ->first();

            if (!$alreadyHas) {
                DB::table('usuario_permissions')->insert([
                    'id' => Str::uuid()->toString(),
                    'usuariId' => $userId,
                    'permission_id' => $permission->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('✅ Todos los permisos asignados al usuario admin');
    }
}
