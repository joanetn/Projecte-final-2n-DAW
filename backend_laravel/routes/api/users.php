<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Users\Presentation\Http\Controllers\UsuariController;

Route::prefix('users')->group(function () {
    // CRUD básico
    Route::get('/', [UsuariController::class, 'index']);
    Route::post('/', [UsuariController::class, 'store']);
    Route::get('/{id}', [UsuariController::class, 'show']);
    Route::put('/{id}', [UsuariController::class, 'update']);
    Route::delete('/{id}', [UsuariController::class, 'destroy']);

    // Acciones específicas
    Route::post('/{id}/deactivate', [UsuariController::class, 'deactivate']);
    Route::post('/{id}/activate', [UsuariController::class, 'activate']);
});
