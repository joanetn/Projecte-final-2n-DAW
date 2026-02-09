<?php

namespace App\Modules\User\Domain\Entities;

class UserRol
{
    public function __construct(
        public readonly string $id,
        public readonly string $usuariId,
        public readonly string $rol,
        public readonly ?string $createdAt,
        public readonly bool $isActive = true,
    ) {}

    public function isActiveRol(): bool
    {
        return $this->isActive;
    }
}
