<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jornadas', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nom');
            $table->dateTime('dataInici');
            $table->dateTime('dataFi')->nullable();
            $table->string('lligaId');
            $table->string('status')->default('PENDENT');
            $table->boolean('isActive')->default(true);

            $table->foreign('lligaId')->references('id')->on('lligas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jornadas');
    }
};
