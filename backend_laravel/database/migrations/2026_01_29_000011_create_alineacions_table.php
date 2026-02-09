<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration {
    public function up(): void
    {
        Schema::create('alineacions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('partitId');
            $table->uuid('jugadorId');
            $table->uuid('equipId');
            $table->string('posicio')->nullable();
            $table->boolean('isActive')->default(true);
            $table->timestamp('creada_at')->default(DB::raw('CURRENT_TIMESTAMP'));

            $table->foreign('partitId')->references('id')->on('partits')->onDelete('cascade');
            $table->foreign('jugadorId')->references('id')->on('usuaris')->onDelete('cascade');
            $table->foreign('equipId')->references('id')->on('equips')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alineacions');
    }
};
