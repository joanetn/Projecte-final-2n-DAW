<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Notifications\Presentation\Http\Controllers\NotificationController;

Route::middleware(['jwt.auth'])->prefix('notifications')->group(function () {
    Route::post('/broadcasting/auth', [NotificationController::class, 'broadcastAuth']);
    Route::get('/me', [NotificationController::class, 'myNotifications']);
    Route::get('/user/{userId}', [NotificationController::class, 'notificationsByUser']);
    Route::post('/sms/send', [NotificationController::class, 'sendSms']);
    Route::post('/whatsapp/send', [NotificationController::class, 'sendSms']);
    Route::post('/enqueue', [NotificationController::class, 'enqueue']);
    Route::post('/process-next', [NotificationController::class, 'processNext']);
    Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
});

Route::post('/webhook/whatsapp', function (\Illuminate\Http\Request $request) {
    $from = $request->input('From');
    $body = $request->input('Body');

    return response(
        '<Response>
            <Message>Este chat es solo informativo, no mandes mensajes a este número.</Message>
        </Response>',
        200
    )->header('Content-Type', 'text/xml');
});
