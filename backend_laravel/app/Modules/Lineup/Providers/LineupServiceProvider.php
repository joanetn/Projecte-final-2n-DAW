<?php

/**
 * Service Provider del mòdul Lineup.
 *
 * Registra els bindings de les interfícies de repositoris amb les seves
 * implementacions concretes d'Eloquent. Laravel usa aquests bindings
 * per injectar automàticament les dependències als Commands i Queries
 * (Dependency Injection via el Service Container).
 *
 * Interfícies (Domini) → Implementacions (Infraestructura):
 * - AlineacioRepositoryInterface → EloquentAlineacioRepository
 * - PartitJugadorRepositoryInterface → EloquentPartitJugadorRepository
 * - PuntuacioRepositoryInterface → EloquentPuntuacioRepository
 */

namespace App\Modules\Lineup\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories\EloquentAlineacioRepository;
use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories\EloquentPartitJugadorRepository;
use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories\EloquentPuntuacioRepository;

class LineupServiceProvider extends ServiceProvider
{
    /**
     * Registra els bindings d'interfícies → implementacions al Service Container.
     * Això permet que Laravel injecti automàticament els repositoris Eloquent
     * quan es demana una interfície de repositori.
     */
    public function register()
    {
        // Binding: Alineacions
        $this->app->bind(
            AlineacioRepositoryInterface::class,
            EloquentAlineacioRepository::class
        );

        // Binding: Jugadors per Partit
        $this->app->bind(
            PartitJugadorRepositoryInterface::class,
            EloquentPartitJugadorRepository::class
        );

        // Binding: Puntuacions
        $this->app->bind(
            PuntuacioRepositoryInterface::class,
            EloquentPuntuacioRepository::class
        );
    }

    /**
     * Carrega les migracions del mòdul des del directori compartit.
     */
    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
