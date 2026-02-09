<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('equips', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->string('categoria');
            $table->uuid('clubId');
            $table->uuid('lligaId')->nullable();
            $table->timestamps();
            $table->boolean('isActive')->default(true);

            $table->foreign('clubId')->references('id')->on('clubs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equips');
    }
};
