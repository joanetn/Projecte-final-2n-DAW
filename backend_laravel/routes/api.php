<?php

use Illuminate\Support\Facades\Route;

/**
 * API GATEWAY - Punto de entrada centralizado
 * Todos los módulos se registran aquí
 */

Route::middleware('api')->prefix('api')->group(function () {
    // Cargar dinámicamente las rutas de cada módulo si existen
    foreach (glob(base_path('app/Modules/*/Routes/api.php')) as $routesFile) {
        require $routesFile;
    }
});
