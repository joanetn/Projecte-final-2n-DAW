<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarisController;

Route::prefix('usuaris')->group(function () {
    Route::get('/info', [UsuarisController::class, 'voreTot']);
    Route::get('/', [UsuarisController::class, 'index']);
    Route::get('/{id}', [UsuarisController::class, 'show']);
    // Route::post('/', [UsuarisController::class, 'register']);
    Route::put('/{id}', [UsuarisController::class, 'update']);
    Route::delete('/{id}', [UsuarisController::class, 'destroy']);
    Route::put('/rol/{id}', [UsuarisController::class, 'canviRol']);
});