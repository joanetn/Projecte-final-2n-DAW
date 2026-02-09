<?php

use Illuminate\Support\Facades\Route;
use App\Modules\League\Presentation\Http\Controllers\LeagueController;
use App\Modules\League\Presentation\Http\Controllers\RoundController;
use App\Modules\League\Presentation\Http\Controllers\StandingController;

Route::prefix('lligues')->group(function () {
    Route::get('/', [LeagueController::class, 'index']);
    Route::get('/{id}', [LeagueController::class, 'show']);
    Route::get('/{id}/detail', [LeagueController::class, 'showDetail']);
    Route::post('/', [LeagueController::class, 'store']);
    Route::put('/{id}', [LeagueController::class, 'update']);
    Route::delete('/{id}', [LeagueController::class, 'destroy']);
});

Route::prefix('jornades')->group(function () {
    Route::get('/', [RoundController::class, 'index']);
    Route::get('/{id}', [RoundController::class, 'show']);
    Route::get('/{id}/detail', [RoundController::class, 'showDetail']);
    Route::post('/', [RoundController::class, 'store']);
    Route::put('/{id}', [RoundController::class, 'update']);
    Route::delete('/{id}', [RoundController::class, 'destroy']);
});

Route::prefix('classificacions')->group(function () {
    Route::get('/', [StandingController::class, 'index']);
    Route::get('/{id}', [StandingController::class, 'show']);
    Route::get('/{id}/detail', [StandingController::class, 'showDetail']);
    Route::post('/', [StandingController::class, 'store']);
    Route::put('/{id}', [StandingController::class, 'update']);
    Route::delete('/{id}', [StandingController::class, 'destroy']);
});
