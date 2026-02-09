<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('puntuacions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('partitId');
            $table->uuid('jugadorId');
            $table->integer('punts')->default(0);
            $table->boolean('isActive')->default(true);

            $table->foreign('partitId')->references('id')->on('partits')->onDelete('cascade');
            $table->foreign('jugadorId')->references('id')->on('usuaris')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('puntuacions');
    }
};
