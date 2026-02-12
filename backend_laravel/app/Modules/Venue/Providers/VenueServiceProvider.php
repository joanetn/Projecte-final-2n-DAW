<?php

/**
 * ServiceProvider del mòdul Venue.
 *
 * S'encarrega de registrar les dependències (binding) al contenidor de Laravel.
 * Quan injectem una interfície de repositori al constructor d'un Command/Query,
 * Laravel sap quina implementació concreta Eloquent ha d'utilitzar.
 *
 * Principi SOLID aplicat: Dependency Inversion (D) —
 * les capes superiors (Domini, Aplicació) depenen d'abstraccions (interfícies),
 * no d'implementacions concretes (Eloquent).
 */

namespace App\Modules\Venue\Providers;

// Interfícies del domini (contractes abstractes)
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;

// Implementacions concretes de la infraestructura (Eloquent ORM)
use App\Modules\Venue\Infrastructure\Persistence\Eloquent\Repositories\EloquentInstalacioRepository;
use App\Modules\Venue\Infrastructure\Persistence\Eloquent\Repositories\EloquentPistaRepository;

use Illuminate\Support\ServiceProvider;

class VenueServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Quan algú demani InstalacioRepositoryInterface, Laravel li donarà EloquentInstalacioRepository
        $this->app->bind(
            InstalacioRepositoryInterface::class,
            EloquentInstalacioRepository::class
        );

        // Quan algú demani PistaRepositoryInterface, Laravel li donarà EloquentPistaRepository
        $this->app->bind(
            PistaRepositoryInterface::class,
            EloquentPistaRepository::class
        );
    }

    public function boot(): void
    {
        // Carreguem les migracions des de la carpeta general de migracions del projecte
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
