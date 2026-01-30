<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('set_partits', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('partitId');
            $table->integer('numeroSet');
            $table->integer('jocsLocal')->nullable();
            $table->integer('jocsVisit')->nullable();
            $table->boolean('tiebreak')->default(false);
            $table->integer('puntsLocalTiebreak')->nullable();
            $table->integer('puntsVisitTiebreak')->nullable();

            $table->foreign('partitId')->references('id')->on('partits')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('set_partits');
    }
};
