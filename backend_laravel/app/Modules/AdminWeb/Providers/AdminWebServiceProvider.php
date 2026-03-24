<?php

namespace App\Modules\AdminWeb\Providers;

use App\Modules\AdminWeb\Domain\Repositories\AdminLeaguePlannerRepositoryInterface;
use App\Modules\AdminWeb\Domain\Services\AdminLeaguePlannerDomainService;
use App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Repositories\EloquentAdminLeaguePlannerRepository;
use Illuminate\Support\ServiceProvider;

class AdminWebServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            AdminLeaguePlannerRepositoryInterface::class,
            EloquentAdminLeaguePlannerRepository::class,
        );

        $this->app->singleton(AdminLeaguePlannerDomainService::class);
    }

    public function boot(): void {}
}
