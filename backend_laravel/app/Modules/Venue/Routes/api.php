<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Venue\Presentation\Http\Controllers\VenueController;

Route::prefix('instalacions')->group(function () {
    Route::get('/', [VenueController::class, 'index']);
    Route::get('/{id}', [VenueController::class, 'show']);
    Route::post('/', [VenueController::class, 'store']);
    Route::put('/{id}', [VenueController::class, 'update']);
    Route::delete('/{id}', [VenueController::class, 'destroy']);

    // --- CRUD de pistes dins d'una instal·lació ---
    Route::prefix('{instalacioId}/pistes')->group(function () {
        Route::get('/', [VenueController::class, 'indexPistes']);
        Route::get('/{pistaId}', [VenueController::class, 'showPista']);
        Route::post('/', [VenueController::class, 'storePista']);
        Route::put('/{pistaId}', [VenueController::class, 'updatePista']);
        Route::delete('/{pistaId}', [VenueController::class, 'destroyPista']);
    });
});
