<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('proposta_canvi_data_partits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('partitId');
            $table->uuid('equipProposaId');
            $table->uuid('equipReceptorId');
            $table->uuid('proposatPerUsuariId');
            $table->dateTime('dataHoraProposada');
            $table->text('motiu')->nullable();
            $table->string('status')->default('PENDENT');
            $table->text('respostaText')->nullable();
            $table->uuid('respostaPerUsuariId')->nullable();
            $table->dateTime('respostaAt')->nullable();
            $table->boolean('isActive')->default(true);
            $table->timestamps();

            $table->foreign('partitId')->references('id')->on('partits')->onDelete('cascade');
            $table->foreign('equipProposaId')->references('id')->on('equips')->onDelete('cascade');
            $table->foreign('equipReceptorId')->references('id')->on('equips')->onDelete('cascade');
            $table->foreign('proposatPerUsuariId')->references('id')->on('usuaris')->onDelete('cascade');
            $table->foreign('respostaPerUsuariId')->references('id')->on('usuaris')->onDelete('set null');

            $table->index(['partitId', 'status']);
            $table->index(['equipReceptorId', 'status']);
            $table->index(['equipProposaId', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proposta_canvi_data_partits');
    }
};
