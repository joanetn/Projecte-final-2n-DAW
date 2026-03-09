<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Insurance\Presentation\Http\Controllers\InsuranceController;

/*
|--------------------------------------------------------------------------
| Insurance API Routes
|--------------------------------------------------------------------------
|
| Rutes per al mòdul de Seguros (Insurance).
| Carregades automàticament per routes/api.php → prefix: api/seguros
|
*/

Route::prefix('seguros')->group(function () {

    // ─── Rutes públiques ─────────────────────────────────────────
    Route::get('/', [InsuranceController::class, 'index']);

    // ─── Rutes amb autenticació JWT ──────────────────────────────
    Route::post('/create-payment-intent', [InsuranceController::class, 'createPaymentIntent']);
    Route::get('/usuari/{usuariId}', [InsuranceController::class, 'byUser']);

    // ─── Webhook de Stripe (sense auth) ──────────────────────────
    Route::post('/webhook', [InsuranceController::class, 'webhook']);

    // ─── Wildcard al final ───────────────────────────────────────
    Route::get('/{id}', [InsuranceController::class, 'show']);
});

// ─── Rutes admin ────────────────────────────────────────────────────
Route::prefix('admin/seguros')->group(function () {
    Route::get('/', [InsuranceController::class, 'indexAdmin']);
    Route::get('/search', [InsuranceController::class, 'searchAdmin']);
});
