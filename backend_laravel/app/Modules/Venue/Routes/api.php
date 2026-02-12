<?php

/**
 * Rutes del mòdul Venue.
 *
 * Segueixen el patró REST i agrupen les subrutes de pistes dins de cada instal·lació.
 * Estructura niuada:
 *   /instalacions                                → CRUD d'instal·lacions
 *   /instalacions/{instalacioId}/pistes          → CRUD de pistes dins de cada instal·lació
 *
 * Nota: El prefix 'api' ja ve del fitxer routes/api.php principal,
 * on s'inclouen tots els fitxers de rutes dels mòduls amb glob().
 */

use Illuminate\Support\Facades\Route;
use App\Modules\Venue\Presentation\Http\Controllers\VenueController;

Route::prefix('instalacions')->group(function () {
    // --- CRUD d'instal·lacions ---
    Route::get('/', [VenueController::class, 'index']);           // Llistar totes les instal·lacions
    Route::get('/{id}', [VenueController::class, 'show']);        // Obtenir una instal·lació per ID
    Route::post('/', [VenueController::class, 'store']);          // Crear una instal·lació
    Route::put('/{id}', [VenueController::class, 'update']);      // Actualitzar una instal·lació
    Route::delete('/{id}', [VenueController::class, 'destroy']); // Eliminar (soft delete) una instal·lació

    // --- CRUD de pistes dins d'una instal·lació ---
    Route::prefix('{instalacioId}/pistes')->group(function () {
        Route::get('/', [VenueController::class, 'indexPistes']);              // Llistar pistes d'una instal·lació
        Route::get('/{pistaId}', [VenueController::class, 'showPista']);       // Obtenir una pista concreta
        Route::post('/', [VenueController::class, 'storePista']);              // Crear una pista dins de la instal·lació
        Route::put('/{pistaId}', [VenueController::class, 'updatePista']);     // Actualitzar una pista
        Route::delete('/{pistaId}', [VenueController::class, 'destroyPista']); // Eliminar una pista
    });
});
