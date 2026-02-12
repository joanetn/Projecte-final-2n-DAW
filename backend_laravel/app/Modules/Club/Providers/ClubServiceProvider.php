<?php

namespace App\Modules\Club\Providers;

// Importem les interfícies del domini i les implementacions concretes de la infraestructura
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;
use App\Modules\Club\Domain\Repositories\EquipUsuariRepositoryInterface;
use App\Modules\Club\Infrastructure\Persistence\Eloquent\Repositories\EloquentClubRepository;
use App\Modules\Club\Infrastructure\Persistence\Eloquent\Repositories\EloquentEquipRepository;
use App\Modules\Club\Infrastructure\Persistence\Eloquent\Repositories\EloquentEquipUsuariRepository;
use Illuminate\Support\ServiceProvider;

/**
 * ServiceProvider del mòdul Club.
 * S'encarrega de registrar les dependències (bind) al contenidor de Laravel,
 * així quan injectem una interfície, Laravel sap quina implementació concreta utilitzar.
 */
class ClubServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Quan algú demani ClubRepositoryInterface, Laravel li donarà EloquentClubRepository
        $this->app->bind(
            ClubRepositoryInterface::class,
            EloquentClubRepository::class
        );

        // Quan algú demani EquipRepositoryInterface, Laravel li donarà EloquentEquipRepository
        $this->app->bind(
            EquipRepositoryInterface::class,
            EloquentEquipRepository::class
        );

        // Quan algú demani EquipUsuariRepositoryInterface, Laravel li donarà EloquentEquipUsuariRepository
        $this->app->bind(
            EquipUsuariRepositoryInterface::class,
            EloquentEquipUsuariRepository::class
        );
    }

    public function boot(): void
    {
        // Carreguem les migracions des de la carpeta general de migracions del projecte
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
