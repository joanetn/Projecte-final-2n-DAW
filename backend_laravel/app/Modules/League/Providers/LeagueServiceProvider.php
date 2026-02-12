<?php

namespace App\Modules\League\Providers;

use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use App\Modules\League\Domain\Repositories\RoundRepositoryInterface;
use App\Modules\League\Domain\Repositories\StandingRepositoryInterface;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Repositories\EloquentLeagueRepository;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Repositories\EloquentRoundRepository;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Repositories\EloquentStandingRepository;
use Illuminate\Support\ServiceProvider;

class LeagueServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            LeagueRepositoryInterface::class,
            EloquentLeagueRepository::class
        );

        $this->app->bind(
            RoundRepositoryInterface::class,
            EloquentRoundRepository::class
        );

        $this->app->bind(
            StandingRepositoryInterface::class,
            EloquentStandingRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
