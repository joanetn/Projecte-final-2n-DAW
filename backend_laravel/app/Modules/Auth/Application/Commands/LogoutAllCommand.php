<?php

namespace App\Modules\Auth\Application\Commands;

use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;
use Tymon\JWTAuth\Facades\JWTAuth;

class LogoutAllCommand
{
    public function __construct(
        private EloquentAuthRepository $authRepo,
    ) {}

    public function execute(string $userId): void
    {
        $this->authRepo->revokeAllUserSessionsWithBlacklist($userId);

        try {
            JWTAuth::invalidate(true);
        } catch (\Exception $e) {
        }
    }
}
