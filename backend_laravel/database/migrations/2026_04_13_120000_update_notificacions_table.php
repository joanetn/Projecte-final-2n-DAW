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
        // Drop the old notificacions table
        Schema::dropIfExists('notificacions');

        // Create the new notificacions table with correct schema
        Schema::create('notificacions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('user_id')->nullable();
            $table->string('status')->default('PENDENT');
            $table->string('tone')->default('PROFESIONAL');
            $table->string('urgencia')->default('NORMAL');
            $table->string('suceso');
            $table->boolean('llegit')->default(false);
            $table->json('channels');
            $table->json('data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificacions');
    }
};
