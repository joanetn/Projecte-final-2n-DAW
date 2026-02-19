<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('refresh_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('user_id');
            $table->string('device_id');
            $table->string('device_type')->nullable();
            $table->string('browser')->nullable();
            $table->string('os')->nullable();

            $table->uuid('family_id');

            $table->string('current_token_hash');
            $table->boolean('revoked')->default(false);

            $table->unsignedInteger('session_version');

            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();

            // Relaciones (ya existen en la BD de Prisma)
            // $table->foreign('user_id')
            //     ->references('id')
            //     ->on('users')
            //     ->onDelete('cascade');

            // Índices importantes
            $table->index(['user_id']);
            $table->index(['family_id']);
            $table->index(['device_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refresh_sessions');
    }
};
