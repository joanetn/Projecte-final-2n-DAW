<?php

// Comando de Refresh Token
// Se encarga de:
// 1. Verificar que el refresh token sea válido (JWT válido)
// 2. Buscar la sesión en la BD por familyId
// 3. Comprobar que no esté revocada
// 4. Comprobar que la session_version coincida (no se ha hecho logout global)
// 5. Comprobar que el hash coincida (detectar reuse = token robado)
// 6. Rotar: generar nuevo access token + nuevo refresh token
// 7. Actualizar el hash en la BD

namespace App\Modules\Auth\Application\Commands;

use App\Modules\Auth\Domain\Entities\RefreshSession;
use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;

class RefreshTokenCommand
{
    public function __construct(
        private EloquentAuthRepository $authRepo,
    ) {}

    public function execute(string $refreshToken): array
    {
        try {
            $payload = JWTAuth::setToken($refreshToken)->getPayload();
        } catch (\Exception $e) {
            throw new \Exception('Refresh token inválido o expirado', 401);
        }

        $userId = $payload->get('sub');
        $familyId = $payload->get('familyId');
        $type = $payload->get('type');

        if ($type !== 'refresh' || !$familyId) {
            throw new \Exception('Token no es de tipo refresh', 401);
        }

        $session = $this->authRepo->findRefreshSessionByFamilyId($familyId);
        if (!$session) {
            throw new \Exception('Sesión no encontrada', 401);
        }

        if ($session->isRevoked()) {
            $this->authRepo->revokeAllUserSessions($userId);
            throw new \Exception('Sesión revocada. Posible uso malintencionado. Todas las sesiones han sido cerradas.', 401);
        }

        $currentVersion = $this->authRepo->getUserSessionVersion($userId);
        if ($session->session_version !== $currentVersion) {
            $this->authRepo->revokeRefreshSession($session->id);
            throw new \Exception('Sesión invalidada globalmente', 401);
        }

        $tokenHash = hash('sha256', $refreshToken);
        if ($tokenHash !== $session->current_token_hash) {
            $this->authRepo->revokeRefreshSession($session->id);
            throw new \Exception('Reuse detectado. Sesión revocada por seguridad.', 401);
        }

        $accessPayload = JWTFactory::sub($userId)->make();
        $newAccessToken = JWTAuth::encode($accessPayload)->get();

        $refreshPayload = JWTFactory::sub($userId)
            ->claims([
                'familyId' => $familyId,
                'type' => 'refresh',
            ])
            ->setTTL(60 * 24 * 7)
            ->make();
        $newRefreshToken = JWTAuth::encode($refreshPayload)->get();

        $newTokenHash = hash('sha256', $newRefreshToken);

        $updatedSession = new RefreshSession(
            id: $session->id,
            user_id: $session->user_id,
            device_id: $session->device_id,
            device_type: $session->device_type,
            browser: $session->browser,
            os: $session->os,
            family_id: $session->family_id,
            current_token_hash: $newTokenHash,
            revoked: false,
            session_version: $session->session_version,
            last_used_at: now()->format('Y-m-d H:i:s'),
            createdAt: $session->createdAt,
            updatedAt: now()->format('Y-m-d H:i:s'),
        );

        $this->authRepo->updateRefreshSession($updatedSession);

        return [
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefreshToken,
            'token_type' => 'Bearer',
            'expires_in' => config('jwt.ttl', 15) * 60,
        ];
    }
}
