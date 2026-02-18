<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Merchandise\Presentation\Http\Controllers\MerchandiseController;

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
