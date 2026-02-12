<?php

namespace App\Modules\Match\Providers;

use App\Modules\Match\Infrastructure\Persistence\Eloquent\Repositories\EloquentMatchRepository;
use App\Modules\Match\Infrastructure\Persistence\Eloquent\Repositories\EloquentSetMatchRepository;
use Illuminate\Support\ServiceProvider;
use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;
use App\Modules\Match\Domain\Repositories\MatchSetRepositoryInterface;

class MatchServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            MatchRepositoryInterface::class,
            EloquentMatchRepository::class
        );

        $this->app->bind(
            MatchSetRepositoryInterface::class,
            EloquentSetMatchRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
