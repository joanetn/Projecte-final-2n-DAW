<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('equip_usuaris', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('equipId');
            $table->string('usuariId');
            $table->string('rolEquip');
            $table->boolean('isActive')->default(true);
            $table->timestamp('created_at')->nullable();

            $table->foreign('equipId')->references('id')->on('equips')->onDelete('cascade');
            $table->foreign('usuariId')->references('id')->on('usuaris')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equip_usuaris');
    }
};
