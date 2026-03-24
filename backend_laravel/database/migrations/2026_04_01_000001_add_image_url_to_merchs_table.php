<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('merchs', function (Blueprint $table) {
            $table->string('imageUrl')->nullable()->after('marca');
        });
    }

    public function down(): void
    {
        Schema::table('merchs', function (Blueprint $table) {
            $table->dropColumn('imageUrl');
        });
    }
};
