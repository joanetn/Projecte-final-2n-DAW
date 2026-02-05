<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lligues', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nom');
            $table->string('categoria');
            $table->dateTime('dataInici');
            $table->dateTime('dataFi');
            $table->timestamps();
            $table->string('status')->default('NOT_STARTED');
            $table->boolean('isActive')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lligas');
    }
};
