<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('classificacions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('lligaId');
            $table->uuid('equipId');
            $table->integer('partitsJugats')->default(0);
            $table->integer('partitsGuanyats')->default(0);
            $table->integer('partitsPerduts')->default(0);
            $table->integer('partitsEmpatats')->default(0);
            $table->integer('setsGuanyats')->default(0);
            $table->integer('setsPerduts')->default(0);
            $table->integer('jocsGuanyats')->default(0);
            $table->integer('jocsPerduts')->default(0);
            $table->integer('punts')->default(0);
            $table->timestamps();
            $table->boolean('isActive')->default(true);

            $table->foreign('lligaId')->references('id')->on('lligues')->onDelete('cascade');
            $table->foreign('equipId')->references('id')->on('equips')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classificacions');
    }
};
