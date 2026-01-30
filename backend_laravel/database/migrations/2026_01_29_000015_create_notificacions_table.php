<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notificacions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('usuariId');
            $table->string('titol');
            $table->text('missatge');
            $table->string('tipus')->nullable();
            $table->boolean('read')->default(false);
            $table->boolean('llegit')->default(false);
            $table->text('extra')->nullable();
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->boolean('isActive')->default(true);

            $table->foreign('usuariId')->references('id')->on('usuaris')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificacions');
    }
};
