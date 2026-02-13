<?php

namespace App\Modules\Invitation\Providers;

use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;
use App\Modules\Invitation\Infrastructure\Persistence\Eloquent\Repositories\EloquentInvitacioEquipRepository;
use Illuminate\Support\ServiceProvider;

class InvitationServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            InvitacioEquipRepositoryInterface::class,
            EloquentInvitacioEquipRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
