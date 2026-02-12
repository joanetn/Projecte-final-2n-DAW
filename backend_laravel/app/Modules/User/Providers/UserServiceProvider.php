<?php

namespace App\Modules\User\Providers;

use App\Modules\User\Domain\Repositories\UserRepositoryInterface;
use App\Modules\User\Domain\Repositories\UserRolRepositoryInterface;
use App\Modules\User\Infrastructure\Persistence\Eloquent\Repositories\EloquentUserRepository;
use App\Modules\User\Infrastructure\Persistence\Eloquent\Repositories\EloquentUserRolRepository;
use Illuminate\Support\ServiceProvider;

class UserServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class
        );

        $this->app->bind(
            UserRolRepositoryInterface::class,
            EloquentUserRolRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
