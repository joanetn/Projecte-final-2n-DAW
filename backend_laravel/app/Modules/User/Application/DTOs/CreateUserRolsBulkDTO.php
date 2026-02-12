<?php

namespace App\Modules\User\Application\DTOs;

class CreateUserRolsBulkDTO
{
    public function __construct(
        public readonly string $usuariId,
        public readonly array $roles,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            usuariId: $data['usuariId'],
            roles: $data['roles'],
        );
    }
}
