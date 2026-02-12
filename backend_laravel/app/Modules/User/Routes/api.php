<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Presentation\Http\Controllers\UserController;

Route::prefix('usuaris')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::get('/{id}/detail', [UserController::class, 'showDetail']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);

    Route::prefix('{usuariId}/rols')->group(function () {
        Route::get('/', [UserController::class, 'indexRols']);
        Route::post('/', [UserController::class, 'storeRol']);
        Route::post('/bulk', [UserController::class, 'storeRolsBulk']);
        Route::put('/{rolId}', [UserController::class, 'updateRol']);
        Route::delete('/{rolId}', [UserController::class, 'destroyRol']);
    });
});
