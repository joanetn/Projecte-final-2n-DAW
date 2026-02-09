<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invitacio_equips', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipId');
            $table->uuid('usuariId');
            $table->text('missatge')->nullable();
            $table->string('estat')->nullable();
            $table->timestamps();
            $table->boolean('isActive')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitacio_equips');
    }
};
