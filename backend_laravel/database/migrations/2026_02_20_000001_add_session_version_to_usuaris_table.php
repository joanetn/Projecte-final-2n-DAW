<?php

// Migración para añadir session_version a la tabla de usuarios
// Este campo es necesario para invalidar TODAS las sesiones de un usuario a la vez
// Por ejemplo: cambio de contraseña, logout global, etc.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('usuaris', function (Blueprint $table) {
            // Contador que se incrementa para invalidar todas las sesiones del usuario
            $table->unsignedInteger('session_version')->default(0)->after('isActive');
        });
    }

    public function down(): void
    {
        Schema::table('usuaris', function (Blueprint $table) {
            $table->dropColumn('session_version');
        });
    }
};
