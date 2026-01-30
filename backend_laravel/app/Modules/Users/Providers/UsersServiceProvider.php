<?php

namespace App\Modules\Users\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\Users\Domain\Entities\Usuari;
use App\Modules\Users\Application\Services\UsuariService;
use App\Modules\Users\Infrastructure\Repositories\UsuariRepository;
use App\Modules\Users\Infrastructure\Mappers\UsuariMapper;

class UsersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Registrar Mapper
        $this->app->singleton(UsuariMapper::class, function () {
            return new UsuariMapper();
        });

        // Registrar Repository
        $this->app->singleton(UsuariRepository::class, function ($app) {
            return new UsuariRepository(
                new Usuari(),
                $app->make(UsuariMapper::class),
            );
        });

        // Registrar Service
        $this->app->singleton(UsuariService::class, function ($app) {
            return new UsuariService(
                $app->make(UsuariRepository::class),
            );
        });
    }

    public function boot(): void
    {
        // 
    }
}
