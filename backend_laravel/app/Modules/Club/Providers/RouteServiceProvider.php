<?php

namespace App\Modules\Club\Providers;

use Carbon\Laravel\ServiceProvider;
use Illuminate\Support\Facades\Route;

/**
 * RouteServiceProvider del mòdul Club.
 * Configura el prefix de les rutes API i apunta al fitxer de rutes del mòdul.
 */
class RouteServiceProvider extends ServiceProvider
{
    // Namespace dels controladors d'aquest mòdul
    protected string $moduleNamespace = 'App\Modules\Club\Presentation\Http\Controllers';

    public function boot(): void
    {
        parent::boot();
    }

    public function map(): void
    {
        $this->mapApiRoutes();
    }

    protected function mapApiRoutes(): void
    {
        // Totes les rutes d'aquest mòdul tindran prefix 'api/v1' i middleware 'api'
        Route::prefix('api/v1')
            ->middleware('api')
            ->namespace($this->moduleNamespace)
            ->group(__DIR__ . '/../Routes/api.php');
    }
}
