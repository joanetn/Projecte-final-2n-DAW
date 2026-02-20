<?php

namespace App\Modules\Auth\Application\Commands;

use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;
use Tymon\JWTAuth\Facades\JWTAuth;

class LogoutCommand
{
    public function __construct(
        private EloquentAuthRepository $authRepo,
    ) {}

    public function execute(?string $refreshToken = null): void
    {
        if ($refreshToken) {
            try {
                $payload = JWTAuth::setToken($refreshToken)->getPayload();
                $familyId = $payload->get('familyId');

                if ($familyId) {
                    $session = $this->authRepo->findRefreshSessionByFamilyId($familyId);
                    if ($session) {
                        $this->authRepo->revokeRefreshSession($session->id);
                    }
                }
            } catch (\Exception $e) {
            }
        }

        try {
            JWTAuth::invalidate(true);
        } catch (\Exception $e) {
        }
    }
}
