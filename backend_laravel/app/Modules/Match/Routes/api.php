<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Match\Presentation\Http\Controllers\MatchController;
use App\Modules\Match\Presentation\Http\Controllers\AdminMatchController;


Route::prefix('partits')->group(function () {
    Route::get('/', [MatchController::class, 'index']);
    Route::get('/{id}', [MatchController::class, 'show']);
    Route::get('/{id}/detail', [MatchController::class, 'showDetail']);
    Route::post('/', [MatchController::class, 'store']);
    Route::put('/{id}', [MatchController::class, 'update']);
    Route::delete('/{id}', [MatchController::class, 'destroy']);
    Route::post('/{id}/assign-arbitre', [MatchController::class, 'assignArbitre']);
});

Route::prefix('admin/partits')->group(function () {
    Route::get('/', [AdminMatchController::class, 'index']);
    Route::get('/{id}', [AdminMatchController::class, 'show']);
    Route::get('/{id}/detail', [AdminMatchController::class, 'showDetail']);
    Route::post('/', [AdminMatchController::class, 'store']);
    Route::put('/{id}', [AdminMatchController::class, 'update']);
    Route::delete('/{id}', [AdminMatchController::class, 'destroy']);
});
