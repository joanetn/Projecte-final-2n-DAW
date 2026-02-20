<?php

namespace App\Modules\Auth\Domain\Entities;

class RefreshSession
{
    private function __construct(
        public readonly string $id,
        public readonly string $user_id,
        public readonly string $device_id,
        public readonly ?string $device_type,
        public readonly ?string $browser,
        public readonly ?string $os,
        public readonly string $family_id,
        public readonly string $current_token_hash,
        public readonly bool $revoked = false,
        public readonly int $session_version,
        public readonly ?string $last_used_at,
        public readonly string $createdAt,
        public readonly string $updatedAt
    ) {}

    public function isRevoked(): bool
    {
        return $this->revoked;
    }
}
