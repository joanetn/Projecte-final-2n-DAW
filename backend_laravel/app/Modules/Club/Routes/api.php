<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Club\Presentation\Http\Controllers\ClubController;
use App\Modules\Club\Presentation\Http\Controllers\AdminClubController;

/**
 * Rutes del mòdul Club.
 * Segueixen el patró REST i agrupen les subrutes d'equips i membres dins de cada club/equip.
 */
Route::prefix('clubs')->group(function () {
    // --- CRUD de clubs ---
    Route::get('/', [ClubController::class, 'index']);           // Llistar tots els clubs
    Route::get('/{id}', [ClubController::class, 'show']);        // Obtenir un club per ID
    Route::post('/', [ClubController::class, 'store'])->middleware('jwt.auth');          // Crear un club
    Route::put('/{id}', [ClubController::class, 'update']);      // Actualitzar un club
    Route::delete('/{id}', [ClubController::class, 'destroy']); // Eliminar (soft delete) un club

    // --- CRUD d'equips dins d'un club ---
    Route::prefix('{clubId}/equips')->group(function () {
        Route::get('/', [ClubController::class, 'indexEquips']);           // Llistar equips d'un club
        Route::get('/{equipId}', [ClubController::class, 'showEquip']);   // Obtenir un equip concret
        Route::post('/', [ClubController::class, 'storeEquip'])->middleware(['jwt.auth', 'checkRole:ADMIN_CLUB,ADMIN_WEB']);          // Crear un equip dins del club
        Route::post('/{equipId}/inscripcio-lliga', [ClubController::class, 'inscriureEquipALliga'])->middleware(['jwt.auth', 'checkRole:ADMIN_CLUB,ADMIN_WEB,ENTRENADOR']);
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

Route::prefix('admin/clubs')->group(function () {
    Route::get('/', [AdminClubController::class, 'index']);
    Route::get('/{id}', [AdminClubController::class, 'show']);
    Route::get('/{id}/detail', [AdminClubController::class, 'showDetail']);
    Route::post('/', [AdminClubController::class, 'store']);
    Route::put('/{id}', [AdminClubController::class, 'update']);
    Route::delete('/{id}', [AdminClubController::class, 'destroy']);
});

Route::prefix('admin/equips')->group(function () {
    Route::get('/', [AdminClubController::class, 'indexEquips']);
    Route::get('/{equipId}', [AdminClubController::class, 'showEquip']);
    Route::put('/{equipId}', [AdminClubController::class, 'updateEquip']);
    Route::delete('/{equipId}', [AdminClubController::class, 'destroyEquip']);
    Route::get('/{equipId}/membres', [AdminClubController::class, 'indexMembres'])
        ->middleware(['jwt.auth', 'checkRole:ADMIN_CLUB,ENTRENADOR,ADMIN_WEB']);
    Route::get('/{equipId}/candidats-invitacio', [AdminClubController::class, 'candidatsInvitacio'])
        ->middleware(['jwt.auth', 'checkRole:ADMIN_CLUB,ENTRENADOR,ADMIN_WEB']);
});
