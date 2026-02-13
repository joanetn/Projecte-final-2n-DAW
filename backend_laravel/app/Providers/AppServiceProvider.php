<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use App\Modules\League\Domain\Repositories\RoundRepositoryInterface;
use App\Modules\League\Domain\Repositories\StandingRepositoryInterface;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Repositories\EloquentLeagueRepository;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Repositories\EloquentRoundRepository;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Repositories\EloquentStandingRepository;
use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;
use App\Modules\Match\Domain\Repositories\MatchSetRepositoryInterface;
use App\Modules\Match\Infrastructure\Persistence\Eloquent\Repositories\EloquentMatchRepository;
use App\Modules\Match\Infrastructure\Persistence\Eloquent\Repositories\EloquentSetMatchRepository;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories\EloquentAlineacioRepository;
use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories\EloquentPartitJugadorRepository;
use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories\EloquentPuntuacioRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // League Module Bindings
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

        // Match Module Bindings
        $this->app->bind(
            MatchRepositoryInterface::class,
            EloquentMatchRepository::class
        );

        $this->app->bind(
            MatchSetRepositoryInterface::class,
            EloquentSetMatchRepository::class
        );

        // Lineup Module Bindings (Alineacions + Puntuacions)
        $this->app->bind(
            AlineacioRepositoryInterface::class,
            EloquentAlineacioRepository::class
        );

        $this->app->bind(
            PartitJugadorRepositoryInterface::class,
            EloquentPartitJugadorRepository::class
        );

        $this->app->bind(
            PuntuacioRepositoryInterface::class,
            EloquentPuntuacioRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Validador personalizado para edad mínima
        \Illuminate\Support\Facades\Validator::extend('custom_min_age', function ($attribute, $value, $parameters, $validator) {
            if (!$value) {
                return true;
            }

            $minAge = $parameters[0] ?? 13;
            $birthDate = \Carbon\Carbon::createFromFormat('Y-m-d', $value);
            $age = $birthDate->diffInYears(\Carbon\Carbon::now());

            return $age >= $minAge;
        });
    }
}
