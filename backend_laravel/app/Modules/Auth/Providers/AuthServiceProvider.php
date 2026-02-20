<?php

// Service Provider del módulo Auth
// Registra:
// 1. Binding del repositorio (interfaz → implementación)
// 2. Registro del middleware JWT como alias 'jwt.auth'

namespace App\Modules\Auth\Providers;

use App\Modules\Auth\Domain\Repositories\AuthRepositoryInterface;
use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;
use App\Modules\Auth\Infrastructure\Middleware\JwtMiddleware;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Vincular la interfaz del repositorio con la implementación concreta
        // Cuando alguien inyecte AuthRepositoryInterface, Laravel le dará EloquentAuthRepository
        $this->app->bind(
            AuthRepositoryInterface::class,
            EloquentAuthRepository::class
        );
    }

    public function boot(): void
    {
        // Registrar el middleware JWT con el alias 'jwt.auth'
        // Así se puede usar en las rutas: Route::middleware('jwt.auth')
        $router = $this->app->make(Router::class);
        $router->aliasMiddleware('jwt.auth', JwtMiddleware::class);
    }
}
