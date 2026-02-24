<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Presentation\Http\Controllers\AuthController;

Route::prefix('auth')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/refresh', [AuthController::class, 'refresh']);
});

Route::prefix('auth')->middleware([
    'jwt.auth',
    \App\Modules\Auth\Infrastructure\Middleware\ValidateSessionMiddleware::class,
])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    Route::post('/logout-device', [AuthController::class, 'logoutDevice']);

    Route::get('/sessions', [AuthController::class, 'sessions']);

    Route::get('/me', [AuthController::class, 'me']);
});
