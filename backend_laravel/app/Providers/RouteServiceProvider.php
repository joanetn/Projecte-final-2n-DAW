<?php

namespace App\Providers;

use App\Http\Controllers\GatewayController;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(function () {
                    // Gateway admin endpoints (always local, never proxied)
                    Route::prefix('gateway')->group(function () {
                        Route::get('/health', [GatewayController::class, 'health']);
                        Route::get('/services', [GatewayController::class, 'services']);
                        Route::get('/services/{serviceKey}/health', [GatewayController::class, 'serviceHealth']);
                        Route::post('/services/{serviceKey}/circuit-reset', [GatewayController::class, 'resetCircuit']);
                    });

                    // Module routes (each module loads its own routes)
                    foreach (glob(base_path('app/Modules/*/Routes/api.php')) as $routesFile) {
                        require $routesFile;
                    }
                });

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}
