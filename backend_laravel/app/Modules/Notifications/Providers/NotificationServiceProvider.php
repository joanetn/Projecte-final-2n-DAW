<?php

namespace App\Modules\Notifications\Providers;

use App\Modules\Notifications\Domain\Repositories\NotificationsRespositoryInterface;
use App\Modules\Notifications\Infrastructure\Persistence\Eloquent\Repositories\EloquentNotificationRepository;
use Illuminate\Support\ServiceProvider;

class NotificationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            NotificationsRespositoryInterface::class,
            EloquentNotificationRepository::class
        );
    }

    public function boot(): void
    {
        // Las rutas del módulo se cargan desde routes/api.php (glob de módulos).
        // Evitamos registrarlas aquí para no duplicar endpoints.

        // Cargar migraciones
        $this->loadMigrationsFrom(__DIR__ . '/../../../../database/migrations');
    }
}
