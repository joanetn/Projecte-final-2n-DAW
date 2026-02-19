<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Lineup\Presentation\Http\Controllers\AlineacioController;
use App\Modules\Lineup\Presentation\Http\Controllers\PartitJugadorController;
use App\Modules\Lineup\Presentation\Http\Controllers\PuntuacioController;
use App\Modules\Lineup\Presentation\Http\Controllers\AdminAlineacioController;
use App\Modules\Lineup\Presentation\Http\Controllers\AdminPartitJugadorController;
use App\Modules\Lineup\Presentation\Http\Controllers\AdminPuntuacioController;

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

Route::prefix('admin/alineacions')->group(function () {
    Route::get('/', [AdminAlineacioController::class, 'index']);
    Route::get('/{id}', [AdminAlineacioController::class, 'show']);
    Route::post('/', [AdminAlineacioController::class, 'store']);
    Route::put('/{id}', [AdminAlineacioController::class, 'update']);
    Route::delete('/{id}', [AdminAlineacioController::class, 'destroy']);
});

Route::prefix('admin/partit-jugadors')->group(function () {
    Route::get('/', [AdminPartitJugadorController::class, 'index']);
    Route::get('/{id}', [AdminPartitJugadorController::class, 'show']);
    Route::post('/', [AdminPartitJugadorController::class, 'store']);
    Route::put('/{id}', [AdminPartitJugadorController::class, 'update']);
    Route::delete('/{id}', [AdminPartitJugadorController::class, 'destroy']);
});

Route::prefix('admin/puntuacions')->group(function () {
    Route::get('/', [AdminPuntuacioController::class, 'index']);
    Route::get('/{id}', [AdminPuntuacioController::class, 'show']);
    Route::post('/', [AdminPuntuacioController::class, 'store']);
    Route::put('/{id}', [AdminPuntuacioController::class, 'update']);
    Route::delete('/{id}', [AdminPuntuacioController::class, 'destroy']);
});
