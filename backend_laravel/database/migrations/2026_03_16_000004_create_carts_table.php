<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('usuariId');
            $table->boolean('isActive')->default(true);
            $table->timestamps();

            $table->foreign('usuariId')->references('id')->on('usuaris')->onDelete('cascade');
            $table->index('usuariId');
            $table->index('isActive');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
