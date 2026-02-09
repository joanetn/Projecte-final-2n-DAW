<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pistes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->string('tipus')->nullable();
            $table->uuid('instalacioId');
            $table->timestamps();
            $table->boolean('isActive')->default(true);

            $table->foreign('instalacioId')->references('id')->on('instalacions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pistes');
    }
};
