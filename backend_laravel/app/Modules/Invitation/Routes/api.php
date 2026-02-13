<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Invitation\Presentation\Http\Controllers\InvitationController;

Route::prefix('invitacions')->group(function () {
    Route::get('/', [InvitationController::class, 'indexInvitacions']);
    Route::post('/', [InvitationController::class, 'storeInvitacio']);
    Route::get('/equip/{equipId}', [InvitationController::class, 'invitacionsByEquip']);
    Route::get('/usuari/{usuariId}', [InvitationController::class, 'invitacionsByUsuari']);
    Route::get('/usuari/{usuariId}/pendents', [InvitationController::class, 'pendentsByUsuari']);
    Route::get('/{id}', [InvitationController::class, 'showInvitacio']);
    Route::put('/{id}', [InvitationController::class, 'updateInvitacio']);
    Route::patch('/{id}/respondre', [InvitationController::class, 'respondreInvitacio']);
    Route::delete('/{id}', [InvitationController::class, 'destroyInvitacio']);
});
