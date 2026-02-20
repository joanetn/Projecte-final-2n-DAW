<?php

// Route Service Provider del módulo Auth
// Carga las rutas del módulo bajo el prefijo /api/v1

namespace App\Modules\Auth\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    // Namespace del controller para resolución automática
    protected string $moduleNamespace = 'App\Modules\Auth\Presentation\Http\Controllers';

    public function boot(): void
    {
        // No llamar a parent::boot() — ServiceProvider base no tiene boot()
        $this->mapApiRoutes();
    }

    public function map(): void
    {
        $this->mapApiRoutes();
    }

    protected function mapApiRoutes(): void
    {
        // Todas las rutas del módulo Auth se montan bajo /api/v1
        // con el middleware 'api' aplicado
        Route::prefix('api/v1')
            ->middleware('api')
            ->namespace($this->moduleNamespace)
            ->group(__DIR__ . '/../Routes/api.php');
    }
}
