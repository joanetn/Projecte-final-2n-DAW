<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clubs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->text('descripcio')->nullable();
            $table->string('adreca')->nullable();
            $table->string('ciutat')->nullable();
            $table->string('codiPostal')->nullable();
            $table->string('provincia')->nullable();
            $table->string('telefon')->nullable();
            $table->string('email')->nullable();
            $table->string('web')->nullable();
            $table->integer('anyFundacio')->nullable();
            $table->string('creadorId')->nullable();
            $table->timestamps();
            $table->boolean('isActive')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clubs');
    }
};
