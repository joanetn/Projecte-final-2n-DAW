<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GatewayController;

/*
|--------------------------------------------------------------------------
| API GATEWAY — Punto de entrada centralizado
|--------------------------------------------------------------------------
|
| GATEWAY_ENABLED=true  →  todas las peticiones se proxean a microservicios.
| GATEWAY_ENABLED=false →  modo monolito, rutas locales de cada módulo.
|
| Los endpoints /api/gateway/* SIEMPRE se sirven localmente (admin).
|
| Laravel 12 carga este archivo mediante bootstrap/app.php
| con middleware 'api' y prefix 'api' automáticamente.
|
*/

// ─── Gateway admin endpoints (always local) ──────────────────────
Route::prefix('gateway')->group(function () {
    Route::get('/health', [GatewayController::class, 'health']);
    Route::get('/services', [GatewayController::class, 'services']);
    Route::get('/services/{serviceKey}/health', [GatewayController::class, 'serviceHealth']);
    Route::post('/services/{serviceKey}/circuit-reset', [GatewayController::class, 'resetCircuit']);
});

// ─── Module routes (proxied via gateway or direct) ──────────────────────────────
// When GATEWAY_ENABLED=true  → filtered through ApiGateway middleware (proxying)
// When GATEWAY_ENABLED=false → direct access to controllers (monolith mode)
foreach (glob(base_path('app/Modules/*/Routes/api.php')) as $routesFile) {
    require $routesFile;
}
