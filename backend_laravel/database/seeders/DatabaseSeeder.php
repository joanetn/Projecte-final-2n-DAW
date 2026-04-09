<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Llamar seeders específicos (ejecutar permisos antes que el admin)
        $this->call([
            \Database\Seeders\PermissionsSeeder::class,
            \Database\Seeders\AdminUserSeeder::class,
        ]);
    }
}
