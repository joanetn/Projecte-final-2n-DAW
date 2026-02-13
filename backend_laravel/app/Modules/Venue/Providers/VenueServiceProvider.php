<?php

namespace App\Modules\Venue\Providers;

use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;
use App\Modules\Venue\Infrastructure\Persistence\Eloquent\Repositories\EloquentInstalacioRepository;
use App\Modules\Venue\Infrastructure\Persistence\Eloquent\Repositories\EloquentPistaRepository;

use Illuminate\Support\ServiceProvider;

class VenueServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            InstalacioRepositoryInterface::class,
            EloquentInstalacioRepository::class
        );

        $this->app->bind(
            PistaRepositoryInterface::class,
            EloquentPistaRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
