<?php

namespace App\Modules\Auth\Application\Commands;

use App\Modules\Auth\Domain\Entities\RefreshSession;
use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;

class LoginCommand
{
    public function __construct(
        private EloquentAuthRepository $authRepo,
    ) {}

    public function execute(
        string $email,
        string $password,
        string $deviceId,
        ?string $deviceType = null,
        ?string $browser = null,
        ?string $os = null,
    ): array {
        $user = $this->authRepo->findUserByEmail($email);
        if (!$user) {
            throw new \Exception('Credenciales incorrectas', 401);
        }

        $passwordHash = $this->authRepo->getPasswordHash($email);
        if (!$passwordHash || !Hash::check($password, $passwordHash)) {
            throw new \Exception('Credenciales incorrectas', 401);
        }

        $sessionVersion = $this->authRepo->getUserSessionVersion($user->id);

        $familyId = Str::uuid()->toString();

        $accessPayload = JWTFactory::sub($user->id)
            ->claims([
                'familyId' => $familyId,
            ])
            ->make();
        $accessToken = JWTAuth::encode($accessPayload)->get();

        $refreshPayload = JWTFactory::sub($user->id)
            ->claims([
                'familyId' => $familyId,
                'type' => 'refresh',
            ])
            ->setTTL(60 * 24 * 7)
            ->make();
        $refreshToken = JWTAuth::encode($refreshPayload)->get();

        $tokenHash = hash(algo: 'sha256', data: $refreshToken);

        // Revocar TODAS las sesiones existentes de este dispositivo (no solo la primera)
        // Esto evita que queden sesiones huérfanas y aparezcan duplicadas
        $this->authRepo->revokeDeviceSessions($user->id, $deviceId);

        $session = new RefreshSession(
            id: Str::uuid()->toString(),
            user_id: $user->id,
            device_id: $deviceId,
            device_type: $deviceType,
            browser: $browser,
            os: $os,
            family_id: $familyId,
            current_token_hash: $tokenHash,
            revoked: false,
            session_version: $sessionVersion,
            last_used_at: now()->format('Y-m-d H:i:s'),
            createdAt: now()->format('Y-m-d H:i:s'),
            updatedAt: now()->format('Y-m-d H:i:s'),
        );

        $this->authRepo->createRefreshSession($session);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => config('jwt.ttl', 15) * 60,
            'user' => $user,
        ];
    }
}
