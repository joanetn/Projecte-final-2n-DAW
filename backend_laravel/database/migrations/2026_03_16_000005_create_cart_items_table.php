<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('cartId');
            $table->uuid('merchId');
            $table->integer('quantitat');
            $table->boolean('isActive')->default(true);
            $table->timestamps();

            $table->foreign('cartId')->references('id')->on('carts')->onDelete('cascade');
            $table->foreign('merchId')->references('id')->on('merchs')->onDelete('cascade');

            $table->unique(['cartId', 'merchId']);
            $table->index('cartId');
            $table->index('merchId');
            $table->index('isActive');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
