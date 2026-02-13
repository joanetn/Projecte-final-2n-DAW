<?php

/**
 * Route Service Provider del mòdul Lineup.
 *
 * Configura com es carreguen les rutes API del mòdul.
 * Defineix el prefix 'api/v1', el middleware 'api' i el namespace
 * dels controllers. Segueix el mateix patró que els altres mòduls.
 */

namespace App\Modules\Lineup\Providers;

use Carbon\Laravel\ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    // Namespace base dels controllers d'aquest mòdul
    protected string $moduleNamespace = 'App\Modules\Lineup\Presentation\Http\Controllers';

    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Mapeja les rutes del mòdul.
     */
    public function map(): void
    {
        $this->mapApiRoutes();
    }

    /**
     * Carrega les rutes API amb el prefix 'api/v1',
     * el middleware 'api' i el namespace del mòdul.
     */
    protected function mapApiRoutes(): void
    {
        Route::prefix('api/v1')
            ->middleware('api')
            ->namespace($this->moduleNamespace)
            ->group(__DIR__ . '/../Routes/api.php');
    }
}
