<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('refresh_token_blacklist', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('user_id');
            $table->uuid('family_id');

            $table->string('token_hash');

            $table->timestamp('expires_at');
            $table->timestamp('revoked_at')->useCurrent();

            $table->timestamps();

            // La foreign key ya existe en PostgreSQL desde Prisma
            // $table->foreign('user_id')
            //     ->references('id')
            //     ->on('users')
            //     ->onDelete('cascade');

            $table->index(['token_hash']);
            $table->index(['family_id']);
            $table->index(['expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refresh_token_blacklist');
    }
};
