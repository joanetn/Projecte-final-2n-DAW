<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Lineup\Presentation\Http\Controllers\AlineacioController;
use App\Modules\Lineup\Presentation\Http\Controllers\PartitJugadorController;
use App\Modules\Lineup\Presentation\Http\Controllers\PuntuacioController;
Route::prefix('alineacions')->group(function () {
    Route::get('/', [AlineacioController::class, 'index']);            // Llistar totes
    Route::get('/partit/{partitId}', [AlineacioController::class, 'byPartit']); // Per partit
    Route::get('/{id}', [AlineacioController::class, 'show']);         // Detall per ID
    Route::post('/', [AlineacioController::class, 'store']);           // Crear nova
    Route::put('/{id}', [AlineacioController::class, 'update']);       // Actualitzar
    Route::delete('/{id}', [AlineacioController::class, 'destroy']);   // Eliminar (soft)
});
Route::prefix('partit-jugadors')->group(function () {
    Route::get('/', [PartitJugadorController::class, 'index']);            // Llistar tots
    Route::get('/partit/{partitId}', [PartitJugadorController::class, 'byPartit']); // Per partit
    Route::get('/{id}', [PartitJugadorController::class, 'show']);         // Detall per ID
    Route::post('/', [PartitJugadorController::class, 'store']);           // Crear nou
    Route::put('/{id}', [PartitJugadorController::class, 'update']);       // Actualitzar
    Route::delete('/{id}', [PartitJugadorController::class, 'destroy']);   // Eliminar (soft)
});
Route::prefix('puntuacions')->group(function () {
    Route::get('/', [PuntuacioController::class, 'index']);                // Llistar totes
    Route::get('/ranking', [PuntuacioController::class, 'ranking']);       // Rànquing global
    Route::get('/partit/{partitId}', [PuntuacioController::class, 'byPartit']); // Per partit
    Route::get('/{id}', [PuntuacioController::class, 'show']);             // Detall per ID
    Route::post('/', [PuntuacioController::class, 'store']);               // Crear nova
    Route::put('/{id}', [PuntuacioController::class, 'update']);           // Actualitzar
    Route::delete('/{id}', [PuntuacioController::class, 'destroy']);       // Eliminar (soft)
});
