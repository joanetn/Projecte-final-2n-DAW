<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuario_permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('usuariId');
            $table->uuid('permission_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('usuariId')->references('id')->on('usuaris')->onDelete('cascade');
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');

            // Unique constraint: un usuario no puede tener el mismo permiso dos veces
            $table->unique(['usuariId', 'permission_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario_permissions');
    }
};
