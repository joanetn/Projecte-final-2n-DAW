<?php

namespace App\Modules\Auth\Domain\Repositories;

use App\Modules\User\Domain\Entities\User;
use App\Modules\Auth\Domain\Entities\RefreshSession;

interface AuthRepositoryInterface
{
    public function findUserByEmail(string $email): ?User;

    public function findUserById(string $userId): ?User;

    public function createRefreshSession(RefreshSession $session): RefreshSession;

    public function updateRefreshSession(RefreshSession $session): RefreshSession;

    public function findRefreshSession(string $sessionId): ?RefreshSession;

    public function findRefreshSessionByFamilyId(string $familyId): ?RefreshSession;

    public function findRefreshSessionByDeviceId(string $userId, string $deviceId): ?RefreshSession;

    public function findAllUserDevices(string $userId): array;

    public function revokeRefreshSession(string $sessionId): void;

    public function revokeAllUserSessions(string $userId): void;

    public function revokeDeviceSessions(string $userId, string $deviceId): void;

    public function deleteExpiredSessions(): int;
}
