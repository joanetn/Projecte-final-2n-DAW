<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('actas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('partitId')->unique();
            $table->uuid('arbitreId');
            $table->integer('setsLocal')->nullable();
            $table->integer('setsVisitant')->nullable();
            $table->text('observacions')->nullable();
            $table->text('incidencies')->nullable();
            $table->boolean('validada')->default(false);
            $table->dateTime('dataValidacio')->nullable();
            $table->timestamps();
            $table->boolean('isActive')->default(true);

            $table->foreign('partitId')->references('id')->on('partits')->onDelete('cascade');
            $table->foreign('arbitreId')->references('id')->on('usuaris')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actas');
    }
};
