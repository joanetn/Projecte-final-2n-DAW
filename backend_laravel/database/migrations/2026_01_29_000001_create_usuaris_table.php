<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('usuaris', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nom');
            $table->string('email')->unique();
            $table->string('contrasenya');
            $table->string('telefon')->nullable();
            $table->dateTime('dataNaixement')->nullable();
            $table->string('nivell')->nullable();
            $table->string('avatar')->nullable();
            $table->string('dni')->nullable();
            $table->timestamps();
            $table->boolean('isActive')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuaris');
    }
};
