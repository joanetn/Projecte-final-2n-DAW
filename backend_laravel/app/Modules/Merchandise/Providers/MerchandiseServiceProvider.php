<?php

namespace App\Modules\Merchandise\Providers;

use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories\EloquentMerchRepository;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories\EloquentCompraRepository;
use Illuminate\Support\ServiceProvider;

class MerchandiseServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            MerchRepositoryInterface::class,
            EloquentMerchRepository::class
        );

        $this->app->bind(
            CompraRepositoryInterface::class,
            EloquentCompraRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
