<?php
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
    
    public function register()
    {
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
    
    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
