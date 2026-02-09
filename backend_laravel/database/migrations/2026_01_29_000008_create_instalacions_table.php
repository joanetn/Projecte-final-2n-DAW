<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('instalacions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->string('adreca')->nullable();
            $table->string('telefon')->nullable();
            $table->string('tipusPista')->nullable();
            $table->integer('numPistes')->nullable();
            $table->uuid('clubId')->nullable();
            $table->timestamps();
            $table->boolean('isActive')->default(true);

            $table->foreign('clubId')->references('id')->on('clubs')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instalacions');
    }
};
