<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Merchandise\Presentation\Http\Controllers\MerchandiseController;
use App\Modules\Merchandise\Presentation\Http\Controllers\AdminMerchandiseController;

Route::prefix('merchs')->group(function () {
    Route::get('/', [MerchandiseController::class, 'indexMerchs']);
    Route::get('/brands', [MerchandiseController::class, 'getBrands']);
    Route::post('/', [MerchandiseController::class, 'storeMerch']);
    Route::get('/{id}', [MerchandiseController::class, 'showMerch']);
    Route::put('/{id}', [MerchandiseController::class, 'updateMerch']);
    Route::delete('/{id}', [MerchandiseController::class, 'destroyMerch']);
});

Route::prefix('compras')->group(function () {
    Route::get('/', [MerchandiseController::class, 'indexCompras']);
    Route::post('/', [MerchandiseController::class, 'storeCompra']);
    Route::get('/usuari/{usuariId}', [MerchandiseController::class, 'comprasByUsuari']);
    Route::get('/merch/{merchId}', [MerchandiseController::class, 'comprasByMerch']);
    Route::get('/{id}', [MerchandiseController::class, 'showCompra']);
    Route::put('/{id}', [MerchandiseController::class, 'updateCompra']);
    Route::delete('/{id}', [MerchandiseController::class, 'destroyCompra']);
});

Route::prefix('admin/merchs')->group(function () {
    Route::get('/', [AdminMerchandiseController::class, 'index']);
    Route::get('/{id}', [AdminMerchandiseController::class, 'show']);
    Route::post('/', [AdminMerchandiseController::class, 'store']);
    Route::put('/{id}', [AdminMerchandiseController::class, 'update']);
    Route::delete('/{id}', [AdminMerchandiseController::class, 'destroy']);
});
