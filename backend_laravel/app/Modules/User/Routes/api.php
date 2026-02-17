<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Presentation\Http\Controllers\UserController;
use App\Modules\User\Presentation\Http\Controllers\AdminUserController;

Route::prefix('usuaris')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{usuariId}', [UserController::class, 'show']);
    Route::get('/{usuariId}/detail', [UserController::class, 'showDetail']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{usuariId}', [UserController::class, 'update']);
    Route::delete('/{usuariId}', [UserController::class, 'destroy']);

    Route::prefix('{usuariId}/rols')->group(function () {
        Route::get('/', [UserController::class, 'indexRols']);
        Route::post('/', [UserController::class, 'storeRol']);
        Route::post('/bulk', [UserController::class, 'storeRolsBulk']);
        Route::put('/{rolId}', [UserController::class, 'updateRol']);
        Route::delete('/{rolId}', [UserController::class, 'destroyRol']);
    });
});

Route::prefix('admin/usuaris')->group(function () {
    Route::get('/', [AdminUserController::class, 'index']);
    Route::get('/{usuariId}', [AdminUserController::class, 'show']);
    Route::get('/{usuariId}/detail', [AdminUserController::class, 'showDetail']);
    Route::post('/', [AdminUserController::class, 'store']);
    Route::put('/{usuariId}', [AdminUserController::class, 'update']);
    Route::delete('/{usuariId}', [AdminUserController::class, 'destroy']);

    Route::prefix('{usuariId}/rols')->group(function () {
        Route::get('/', [AdminUserController::class, 'indexRols']);
        Route::post('/', [AdminUserController::class, 'storeRol']);
        Route::post('/bulk', [AdminUserController::class, 'storeRolsBulk']);
        Route::put('/{rolId}', [AdminUserController::class, 'updateRol']);
        Route::delete('/{rolId}', [AdminUserController::class, 'destroyRol']);
    });
});
