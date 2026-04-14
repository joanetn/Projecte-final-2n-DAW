<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Notifications\Presentation\Http\Controllers\NotificationController;

Route::middleware(['jwt.auth'])->prefix('notifications')->group(function () {
    Route::get('/me', [NotificationController::class, 'myNotifications']);
    Route::get('/user/{userId}', [NotificationController::class, 'notificationsByUser']);
    Route::post('/enqueue', [NotificationController::class, 'enqueue']);
    Route::post('/process-next', [NotificationController::class, 'processNext']);
    Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
});
