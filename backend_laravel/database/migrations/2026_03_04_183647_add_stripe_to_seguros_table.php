<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('seguros', function (Blueprint $table) {
            $table->string('stripe_payment_intent_id')->nullable()->unique();
            // unique → idempotencia: 2 webhooks del mismo pago no crean 2 seguros
            $table->decimal('preu', 8, 2)->nullable();
            $table->integer('mesos')->default(12); // duración del seguro
        });
    }

    public function down(): void
    {
        Schema::table('seguros', function (Blueprint $table) {
            $table->dropColumn(['stripe_payment_intent_id', 'preu', 'mesos']);
        });
    }
};
