<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notif', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('userId')->nullable();
            $table->string('status')->default('PENDENT');
            $table->string('tone')->default('PROFESIONAL');
            $table->string('urgencia')->default('NORMAL');
            $table->string('suceso');
            $table->boolean('llegit')->default(false);
            $table->json('channels');
            $table->json('data');
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notif');
    }
};
