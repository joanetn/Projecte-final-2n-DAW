<?php

namespace App\Modules\Auth\Domain\Entities;

class RefreshSession
{
    public function __construct(
        public readonly string $id,
        public readonly string $user_id,
        public readonly string $device_id,
        public readonly ?string $device_type,
        public readonly ?string $browser,
        public readonly ?string $os,
        public readonly string $family_id,
        public readonly string $current_token_hash,
        public readonly bool $revoked = false,
        public readonly int $session_version = 0,
        public readonly ?string $last_used_at = null,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}

    public function isRevoked(): bool
    {
        return $this->revoked;
    }
}
