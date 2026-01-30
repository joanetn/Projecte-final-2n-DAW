<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('partits', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('jornadaId')->nullable();
            $table->string('localId');
            $table->string('visitantId');
            $table->dateTime('dataHora')->nullable();
            $table->string('pistaId')->nullable();
            $table->string('arbitreId')->nullable();
            $table->string('usuariId')->nullable();
            $table->string('status')->default('PENDENT');
            $table->timestamps();
            $table->boolean('isActive')->default(true);

            $table->foreign('jornadaId')->references('id')->on('jornadas')->onDelete('set null');
            $table->foreign('localId')->references('id')->on('equips')->onDelete('cascade');
            $table->foreign('visitantId')->references('id')->on('equips')->onDelete('cascade');
            $table->foreign('pistaId')->references('id')->on('pistes')->onDelete('set null');
            $table->foreign('arbitreId')->references('id')->on('usuaris')->onDelete('set null');
            $table->foreign('usuariId')->references('id')->on('usuaris')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partits');
    }
};
