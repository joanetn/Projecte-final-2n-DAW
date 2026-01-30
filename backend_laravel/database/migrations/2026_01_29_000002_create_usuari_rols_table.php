<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('usuari_rols', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('usuariId');
            $table->string('rol');
            $table->boolean('isActive')->default(true);
            $table->timestamp('created_at')->nullable();

            $table->foreign('usuariId')->references('id')->on('usuaris')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuari_rols');
    }
};
