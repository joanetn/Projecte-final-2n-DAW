<?php

use Illuminate\Support\Facades\Route;

/**
 * API GATEWAY - Punto de entrada centralizado
 * Todos los módulos se registran aquí
 */

Route::middleware('api')->prefix('api')->group(function () {
    // Módulos
    require __DIR__ . '/api/users.php';
});