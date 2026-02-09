<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('merchs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->string('marca')->nullable();
            $table->float('preu')->nullable();
            $table->integer('stock')->nullable();
            $table->timestamps();
            $table->boolean('isActive')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('merchs');
    }
};
