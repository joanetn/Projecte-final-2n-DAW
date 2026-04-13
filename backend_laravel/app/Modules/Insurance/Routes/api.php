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
    Route::middleware(['jwt.auth'])->group(function () {
        Route::get('/', [InsuranceController::class, 'index']);
        Route::get('/usuari/{usuariId}', [InsuranceController::class, 'byUser']);
        Route::get('/{id}', [InsuranceController::class, 'show']);
        Route::post('/create-payment-intent', [InsuranceController::class, 'createPaymentIntent']);
        Route::post('/confirm-payment', [InsuranceController::class, 'confirmPayment']);
    });

    // ─── Webhook de Stripe (sense auth) ──────────────────────────
    Route::post('/webhook', [InsuranceController::class, 'webhook']);
});

// ─── Rutes admin ────────────────────────────────────────────────────
Route::prefix('admin/seguros')->middleware(['jwt.auth', 'checkRole:ADMIN_WEB'])->group(function () {
    Route::get('/', [InsuranceController::class, 'indexAdmin']);
    Route::get('/search', [InsuranceController::class, 'searchAdmin']);
});
