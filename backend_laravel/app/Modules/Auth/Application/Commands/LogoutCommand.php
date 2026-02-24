<?php

namespace App\Modules\Auth\Application\Commands;

use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;
use Tymon\JWTAuth\Facades\JWTAuth;

class LogoutCommand
{
    public function __construct(
        private EloquentAuthRepository $authRepo,
    ) {}

    public function execute(?string $refreshToken = null, ?string $userId = null, ?string $deviceId = null): void
    {
        $sessionRevoked = false;
        $tokenHash = null;
        $expiresAt = null;
        $familyId = null;

        if ($refreshToken) {
            try {
                $payload = JWTAuth::setToken($refreshToken)->getPayload();
                $familyId = $payload->get('familyId');
                $userId = $payload->get('sub');
                $tokenHash = hash('sha256', $refreshToken);
                $expiresAt = \Carbon\Carbon::createFromTimestampUTC($payload->get('exp'));

                if ($familyId) {
                    $session = $this->authRepo->findRefreshSessionByFamilyId($familyId);
                    if ($session) {
                        $this->authRepo->revokeRefreshSession($session->id);
                        $sessionRevoked = true;

                        $this->authRepo->addTokenToBlacklist($tokenHash, $userId, $familyId, $expiresAt);
                    }
                }
            } catch (\Exception $e) {
            }
        }

        if (!$sessionRevoked && $userId && $deviceId) {
            $this->authRepo->revokeDeviceSessions($userId, $deviceId);
        }

        try {
            JWTAuth::invalidate(true);
        } catch (\Exception $e) {
        }
    }
}
