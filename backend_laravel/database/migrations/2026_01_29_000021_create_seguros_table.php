<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('seguros', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('usuariId')->nullable();
            $table->dateTime('dataExpiracio')->nullable();
            $table->boolean('pagat')->default(false);
            $table->timestamps();
            $table->boolean('isActive')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seguros');
    }
};
