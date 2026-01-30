<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('partit_jugadors', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('partitId');
            $table->string('jugadorId');
            $table->string('equipId');
            $table->integer('punts')->default(0);
            $table->boolean('isActive')->default(true);

            $table->foreign('partitId')->references('id')->on('partits')->onDelete('cascade');
            $table->foreign('jugadorId')->references('id')->on('usuaris')->onDelete('cascade');
            $table->foreign('equipId')->references('id')->on('equips')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partit_jugadors');
    }
};
