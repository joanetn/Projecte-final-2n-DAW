<?php

namespace App\Modules\Merchandise\Providers;

use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CartRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CartItemRepositoryInterface;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories\EloquentMerchRepository;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories\EloquentCompraRepository;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories\EloquentCartRepository;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories\EloquentCartItemRepository;
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

        $this->app->bind(
            CartRepositoryInterface::class,
            EloquentCartRepository::class
        );

        $this->app->bind(
            CartItemRepositoryInterface::class,
            EloquentCartItemRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
