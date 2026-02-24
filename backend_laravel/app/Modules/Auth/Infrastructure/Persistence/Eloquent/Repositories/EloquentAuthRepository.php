<?php

namespace App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Auth\Domain\Entities\RefreshSession;
use App\Modules\Auth\Domain\Repositories\AuthRepositoryInterface;
use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Models\RefreshSessionModel;
use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Models\TokenBlacklistModel;
use App\Modules\Auth\Infrastructure\Persistence\Mappers\RefreshSessionMapper;
use App\Modules\User\Domain\Entities\User;
use App\Modules\User\Infrastructure\Persistence\Eloquent\Models\UserModel;
use App\Modules\User\Infrastructure\Persistence\Mappers\UserMapper;

class EloquentAuthRepository implements AuthRepositoryInterface
{
    public function __construct(
        private RefreshSessionModel $sessionModel,
        private UserModel $userModel,
        private TokenBlacklistModel $blacklistModel,
    ) {}

    public function findUserByEmail(string $email): ?User
    {
        $model = $this->userModel
            ->where('email', $email)
            ->where('isActive', true)
            ->first();

        return $model ? UserMapper::toDomain($model) : null;
    }

    public function findUserById(string $userId): ?User
    {
        $model = $this->userModel
            ->where('isActive', true)
            ->find($userId);

        return $model ? UserMapper::toDomain($model) : null;
    }

    public function createRefreshSession(RefreshSession $session): RefreshSession
    {
        $model = $this->sessionModel->create(
            RefreshSessionMapper::toArray($session)
        );

        return RefreshSessionMapper::toDomain($model);
    }

    public function updateRefreshSession(RefreshSession $session): RefreshSession
    {
        $model = $this->sessionModel->findOrFail($session->id);

        $model->update(RefreshSessionMapper::toArray($session));

        return RefreshSessionMapper::toDomain($model->fresh());
    }

    public function findRefreshSession(string $sessionId): ?RefreshSession
    {
        $model = $this->sessionModel->find($sessionId);

        return $model ? RefreshSessionMapper::toDomain($model) : null;
    }

    public function findRefreshSessionByFamilyId(string $familyId): ?RefreshSession
    {
        $model = $this->sessionModel
            ->where('family_id', $familyId)
            ->first();

        return $model ? RefreshSessionMapper::toDomain($model) : null;
    }

    public function findRefreshSessionByDeviceId(string $userId, string $deviceId): ?RefreshSession
    {
        $model = $this->sessionModel
            ->where('user_id', $userId)
            ->where('device_id', $deviceId)
            ->first();

        return $model ? RefreshSessionMapper::toDomain($model) : null;
    }

    public function findAllUserDevices(string $userId): array
    {
        $models = $this->sessionModel
            ->where('user_id', $userId)
            ->where('revoked', false)
            ->orderBy('last_used_at', 'desc')
            ->get();

        return $models->map([RefreshSessionMapper::class, 'toDomain'])->toArray();
    }

    public function revokeRefreshSession(string $sessionId): void
    {
        $this->sessionModel
            ->where('id', $sessionId)
            ->update(['revoked' => true]);
    }

    public function revokeAllUserSessions(string $userId): void
    {
        $this->sessionModel
            ->where('user_id', $userId)
            ->update(['revoked' => true]);

        $this->userModel
            ->where('id', $userId)
            ->increment('session_version');
    }

    public function revokeDeviceSessions(string $userId, string $deviceId): void
    {
        $this->sessionModel
            ->where('user_id', $userId)
            ->where('device_id', $deviceId)
            ->update(['revoked' => true]);
    }

    public function deleteExpiredSessions(): int
    {
        return $this->sessionModel
            ->where('revoked', true)
            ->where('updated_at', '<', now()->subDays(7))
            ->delete();
    }

    public function getPasswordHash(string $email): ?string
    {
        $model = $this->userModel
            ->where('email', $email)
            ->where('isActive', true)
            ->first();

        return $model?->contrasenya;
    }

    public function getUserSessionVersion(string $userId): int
    {
        return (int) $this->userModel
            ->where('id', $userId)
            ->value('session_version');
    }

    public function addTokenToBlacklist(string $tokenHash, string $userId, string $familyId, \DateTime $expiresAt): void
    {
        $this->blacklistModel->create([
            'token_hash' => $tokenHash,
            'user_id' => $userId,
            'family_id' => $familyId,
            'expires_at' => $expiresAt,
            'revoked_at' => now(),
        ]);
    }

    public function isTokenBlacklisted(string $tokenHash): bool
    {
        return $this->blacklistModel
            ->where('token_hash', $tokenHash)
            ->where('expires_at', '>', now())
            ->exists();
    }

    public function cleanupExpiredBlacklistTokens(): int
    {
        return $this->blacklistModel
            ->where('expires_at', '<', now())
            ->delete();
    }

    public function revokeAllUserSessionsWithBlacklist(string $userId): void
    {
        $this->revokeAllUserSessions($userId);
    }
}
