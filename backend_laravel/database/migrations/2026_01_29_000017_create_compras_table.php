<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('compras', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('usuariId');
            $table->uuid('merchId');
            $table->integer('quantitat');
            $table->float('total');
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->boolean('pagat')->default(false);
            $table->string('status')->default('PENDENT');
            $table->boolean('isActive')->default(true);

            $table->foreign('usuariId')->references('id')->on('usuaris')->onDelete('cascade');
            $table->foreign('merchId')->references('id')->on('merchs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compras');
    }
};
