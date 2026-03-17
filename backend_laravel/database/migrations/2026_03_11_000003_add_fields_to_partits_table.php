<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('partits', function (Blueprint $table) {
            $table->string('ubicacio')->nullable()->after('status');
            $table->integer('setsLocal')->default(0)->after('ubicacio');
            $table->integer('setsVisitant')->default(0)->after('setsLocal');
        });
    }

    public function down(): void
    {
        Schema::table('partits', function (Blueprint $table) {
            $table->dropColumn(['ubicacio', 'setsLocal', 'setsVisitant']);
        });
    }
};
