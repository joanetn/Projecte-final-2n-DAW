<?php

namespace App\Modules\League\Providers;

use Carbon\Laravel\ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    protected string $moduleNamespace = 'App\Modules\League\Presentation\Http\Controllers';

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
        Route::prefix('api/v1')
            ->middleware('api')
            ->namespace($this->moduleNamespace)
            ->group(__DIR__ . '/../Routes/api.php');
    }
}
