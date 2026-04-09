<?php

use Illuminate\Support\Facades\Route;
use App\Modules\AdminWeb\Presentation\Http\Controllers\AdminWebController;
use App\Modules\AdminWeb\Presentation\Http\Controllers\AdminLeaguePlannerController;
use App\Modules\AdminWeb\Presentation\Http\Controllers\AdminPermissionsController;

/*
|--------------------------------------------------------------------------
| Admin Web Routes
|--------------------------------------------------------------------------
|
| Requieren:
|   - jwt.auth       → valida el token JWT y establece auth_user_id en request
|   - checkRole      → verifica que el usuario tiene rol ADMIN_WEB
|   - checkPermission → (en rutas sensibles) verifica permisos específicos
|
*/

Route::middleware(['jwt.auth', 'checkRole:ADMIN_WEB'])
    ->prefix('admin-web')
    ->group(function () {

        // Estadístiques
        Route::get('/estadistiques', [AdminWebController::class, 'estadistiques']);

        // Usuaris
        Route::get('/usuaris', [AdminWebController::class, 'llistarUsuaris']);

        Route::patch('/usuaris/{usuariId}/toggle', [AdminWebController::class, 'toggleUsuariActiu'])
            ->middleware('checkPermission:admin.usuaris.toggle');

        Route::patch('/usuaris/{usuariId}/rols', [AdminWebController::class, 'canviarRolsUsuari'])
            ->middleware('checkPermission:admin.usuaris.edit');

        Route::delete('/usuaris/{usuariId}', [AdminWebController::class, 'eliminarUsuari'])
            ->middleware('checkPermission:admin.usuaris.delete');

        // Equips
        Route::get('/equips', [AdminWebController::class, 'llistarEquips']);

        Route::post('/equips', [AdminWebController::class, 'crearEquip'])
            ->middleware('checkPermission:admin.equips.create');

        Route::patch('/equips/{equipId}', [AdminWebController::class, 'actualitzarEquip'])
            ->middleware('checkPermission:admin.equips.edit');

        Route::delete('/equips/{equipId}', [AdminWebController::class, 'eliminarEquip'])
            ->middleware('checkPermission:admin.equips.delete');

        Route::get('/equips/{equipId}/membres', [AdminWebController::class, 'membresEquip']);

        // Lligues
        Route::get('/lligues', [AdminWebController::class, 'llistarLligues']);

        Route::post('/lligues', [AdminWebController::class, 'crearLliga'])
            ->middleware('checkPermission:admin.lligues.create');

        Route::patch('/lligues/{lligaId}', [AdminWebController::class, 'actualitzarLliga'])
            ->middleware('checkPermission:admin.lligues.edit');

        Route::get('/lligues/{lligaId}/equips', [AdminLeaguePlannerController::class, 'equipsLliga']);

        Route::post('/lligues/{lligaId}/generar-partits', [AdminLeaguePlannerController::class, 'generarPartitsLliga'])
            ->middleware('checkPermission:admin.lligues.edit');

        Route::delete('/lligues/{lligaId}', [AdminWebController::class, 'eliminarLliga'])
            ->middleware('checkPermission:admin.lligues.delete');

        // Partits
        Route::get('/partits', [AdminWebController::class, 'llistarPartits']);

        Route::post('/partits', [AdminWebController::class, 'crearPartit'])
            ->middleware('checkPermission:admin.partits.create');

        Route::patch('/partits/{partitId}', [AdminWebController::class, 'actualitzarPartit'])
            ->middleware('checkPermission:admin.partits.edit');

        Route::delete('/partits/{partitId}', [AdminWebController::class, 'eliminarPartit'])
            ->middleware('checkPermission:admin.partits.delete');

        Route::patch('/partits/{partitId}/arbitre', [AdminWebController::class, 'assignarArbitre'])
            ->middleware('checkPermission:admin.arbitres.assign');

        // Àrbitres
        Route::get('/arbitres', [AdminWebController::class, 'llistarArbitres']);
        Route::get('/arbitres/{arbitreId}/partits', [AdminWebController::class, 'partitsArbitre']);

        // Classificacions
        Route::get('/classificacions', [AdminWebController::class, 'classificacions']);

        // Permisos
        Route::get('/permisos', [AdminPermissionsController::class, 'llistarPermisos'])
            ->middleware('checkPermission:admin.usuaris.edit');

        Route::get('/usuaris-permisos', [AdminPermissionsController::class, 'llistarUsuarisPermisos'])
            ->middleware('checkPermission:admin.usuaris.edit');

        Route::get('/usuaris/{usuariId}/permisos', [AdminPermissionsController::class, 'obtenirPermisosUsuari'])
            ->middleware('checkPermission:admin.usuaris.edit');

        Route::patch('/usuaris/{usuariId}/permisos', [AdminPermissionsController::class, 'actualizarPermisosUsuari'])
            ->middleware('checkPermission:admin.usuaris.edit');

        Route::post('/usuaris/{usuariId}/permisos/todos', [AdminPermissionsController::class, 'asignarTodosLosPermisos'])
            ->middleware('checkPermission:admin.usuaris.edit');

        Route::delete('/usuaris/{usuariId}/permisos', [AdminPermissionsController::class, 'limpiarPermisosDirectos'])
            ->middleware('checkPermission:admin.usuaris.edit');
    });

Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/admin-web/propostes-reprogramacio/me', [AdminLeaguePlannerController::class, 'mevesPropostes']);
    Route::post('/admin-web/partits/{partitId}/propostes-reprogramacio', [AdminLeaguePlannerController::class, 'enviarPropostaCanviData']);
    Route::patch('/admin-web/propostes-reprogramacio/{propostaId}/respondre', [AdminLeaguePlannerController::class, 'respondreProposta']);
});
