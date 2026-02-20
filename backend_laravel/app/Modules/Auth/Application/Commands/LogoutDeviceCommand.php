<?php

namespace App\Modules\Auth\Application\Commands;

use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;

class LogoutDeviceCommand
{
    public function __construct(
        private EloquentAuthRepository $authRepo,
    ) {}

    public function execute(string $userId, string $deviceId): void
    {
        $this->authRepo->revokeDeviceSessions($userId, $deviceId);
    }
}
