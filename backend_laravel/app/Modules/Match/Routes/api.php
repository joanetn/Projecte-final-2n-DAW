<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Match\Presentation\Http\Controllers\MatchController;


Route::prefix('partits')->group(function () {
    Route::get('/', [MatchController::class, 'index']);
    Route::get('/{id}', [MatchController::class, 'show']);
    Route::get('/{id}/detail', [MatchController::class, 'showDetail']);
    Route::post('/', [MatchController::class, 'store']);
    Route::put('/{id}', [MatchController::class, 'update']);
    Route::delete('/{id}', [MatchController::class, 'destroy']);
    Route::post('/{id}/assign-arbitre', [MatchController::class, 'assignArbitre']);
});
