<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Presentation\Http\Controllers\UserController;
use App\Modules\User\Presentation\Http\Controllers\AdminUserController;

Route::prefix('usuaris')->group(function () {
    Route::get('/', [UserController::class, 'index'])->middleware(['jwt.auth', 'checkRole:ADMIN_WEB']);
    Route::get('/nivells', [UserController::class, 'getLevels']);
    Route::get('/me/detail', [UserController::class, 'showMeDetail'])->middleware('jwt.auth');
    Route::get('/me/equips', [UserController::class, 'showMeEquips'])->middleware('jwt.auth');
    Route::get('/{usuariId}', [UserController::class, 'show'])->middleware('jwt.auth');
    Route::get('/{usuariId}/detail', [UserController::class, 'showDetail'])->middleware('jwt.auth');
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{usuariId}', [UserController::class, 'update'])->middleware('jwt.auth');
    Route::delete('/{usuariId}', [UserController::class, 'destroy'])->middleware('jwt.auth');

    Route::prefix('{usuariId}/rols')->middleware(['jwt.auth', 'checkRole:ADMIN_WEB'])->group(function () {
        Route::get('/', [UserController::class, 'indexRols']);
        Route::post('/', [UserController::class, 'storeRol']);
        Route::post('/bulk', [UserController::class, 'storeRolsBulk']);
        Route::put('/{rolId}', [UserController::class, 'updateRol']);
        Route::delete('/{rolId}', [UserController::class, 'destroyRol']);
    });
});

Route::prefix('admin/usuaris')->middleware(['jwt.auth', 'checkRole:ADMIN_WEB'])->group(function () {
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
