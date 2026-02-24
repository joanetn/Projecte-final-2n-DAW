<?php

namespace App\Modules\Auth\Application\Commands;

use App\Modules\Auth\Domain\Entities\RefreshSession;
use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;
use Tymon\JWTAuth\Facades\JWTAuth;

class LogoutDeviceCommand
{
    public function __construct(
        private EloquentAuthRepository $authRepo,
    ) {}

    public function execute(string $userId, string $deviceId, ?string $refreshToken = null): void
    {
        $this->authRepo->revokeDeviceSessions($userId, $deviceId);

        // Agregar token a blacklist si se proporciona
        if ($refreshToken) {
            try {
                $payload = JWTAuth::setToken($refreshToken)->getPayload();
                $familyId = $payload->get('familyId');
                $tokenHash = hash('sha256', $refreshToken);
                $expiresAt = \Carbon\Carbon::createFromTimestampUTC($payload->get('exp'));

                $this->authRepo->addTokenToBlacklist($tokenHash, $userId, $familyId, $expiresAt);
            } catch (\Exception $e) {
                // Si hay error al parsear el token, continuar
            }
        }
    }

    public function findSessionByFamilyId(string $familyId): ?RefreshSession
    {
        return $this->authRepo->findRefreshSessionByFamilyId($familyId);
    }
}
