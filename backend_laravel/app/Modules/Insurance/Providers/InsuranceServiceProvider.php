<?php

namespace App\Modules\Insurance\Providers;

use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;
use App\Modules\Insurance\Infrastructure\Persistence\Eloquent\Repositories\EloquentInsuranceRepository;
use Illuminate\Support\ServiceProvider;

class InsuranceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            InsuranceRepositoryInterface::class,
            EloquentInsuranceRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
