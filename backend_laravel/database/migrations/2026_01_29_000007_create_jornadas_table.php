<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jornadas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->dateTime('dataInici');
            $table->dateTime('dataFi')->nullable();
            $table->uuid('lligaId');
            $table->string('status')->default('PENDENT');
            $table->boolean('isActive')->default(true);

            $table->foreign('lligaId')->references('id')->on('lligues')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jornadas');
    }
};
