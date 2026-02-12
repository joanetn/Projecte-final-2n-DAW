<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Club\Presentation\Http\Controllers\ClubController;

/**
 * Rutes del mòdul Club.
 * Segueixen el patró REST i agrupen les subrutes d'equips i membres dins de cada club/equip.
 */
Route::prefix('clubs')->group(function () {
    // --- CRUD de clubs ---
    Route::get('/', [ClubController::class, 'index']);           // Llistar tots els clubs
    Route::get('/{id}', [ClubController::class, 'show']);        // Obtenir un club per ID
    Route::post('/', [ClubController::class, 'store']);          // Crear un club
    Route::put('/{id}', [ClubController::class, 'update']);      // Actualitzar un club
    Route::delete('/{id}', [ClubController::class, 'destroy']); // Eliminar (soft delete) un club

    // --- CRUD d'equips dins d'un club ---
    Route::prefix('{clubId}/equips')->group(function () {
        Route::get('/', [ClubController::class, 'indexEquips']);           // Llistar equips d'un club
        Route::get('/{equipId}', [ClubController::class, 'showEquip']);   // Obtenir un equip concret
        Route::post('/', [ClubController::class, 'storeEquip']);          // Crear un equip dins del club
        Route::put('/{equipId}', [ClubController::class, 'updateEquip']);      // Actualitzar un equip
        Route::delete('/{equipId}', [ClubController::class, 'destroyEquip']); // Eliminar un equip

        // --- CRUD de membres (equip_usuaris) dins d'un equip ---
        Route::prefix('{equipId}/membres')->group(function () {
            Route::get('/', [ClubController::class, 'indexMembres']);              // Llistar membres d'un equip
            Route::post('/', [ClubController::class, 'storeMembre']);              // Afegir un membre a l'equip
            Route::put('/{membreId}', [ClubController::class, 'updateMembre']);    // Actualitzar un membre
            Route::delete('/{membreId}', [ClubController::class, 'destroyMembre']); // Eliminar un membre
        });
    });
});
