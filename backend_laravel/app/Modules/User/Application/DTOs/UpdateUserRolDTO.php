<?php

namespace App\Modules\User\Application\DTOs;

class UpdateUserRolDTO
{
    public function __construct(
        public readonly string $usuariId,
        public readonly string $rolId,
        public readonly bool $isActive,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            usuariId: $data['usuariId'],
            rolId: $data['rolId'],
            isActive: $data['isActive'] ?? true,
        );
    }
}
