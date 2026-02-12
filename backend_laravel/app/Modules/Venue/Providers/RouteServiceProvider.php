<?php

/**
 * RouteServiceProvider del mòdul Venue.
 *
 * Configura el prefix de les rutes API i apunta al fitxer de rutes del mòdul.
 * Totes les rutes d'aquest mòdul tindran prefix 'api/v1' i middleware 'api'.
 * El namespace apunta als controladors del mòdul Venue.
 */

namespace App\Modules\Venue\Providers;

use Carbon\Laravel\ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    // Namespace dels controladors d'aquest mòdul
    protected string $moduleNamespace = 'App\Modules\Venue\Presentation\Http\Controllers';

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
