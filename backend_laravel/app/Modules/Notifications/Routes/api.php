<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Notifications\Presentation\Http\Controllers\NotificationController;

Route::prefix('notifications')->group(function () {
    Route::post('/enqueue', [NotificationController::class, 'enqueue']);
});
