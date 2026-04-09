<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('proposta_canvi_data_partits') && Schema::hasColumn('proposta_canvi_data_partits', 'estat')) {
            Schema::table('proposta_canvi_data_partits', function (Blueprint $table) {
                $table->renameColumn('estat', 'status');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('proposta_canvi_data_partits') && Schema::hasColumn('proposta_canvi_data_partits', 'status')) {
            Schema::table('proposta_canvi_data_partits', function (Blueprint $table) {
                $table->renameColumn('status', 'estat');
            });
        }
    }
};
