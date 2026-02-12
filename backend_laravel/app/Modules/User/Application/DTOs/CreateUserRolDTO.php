<?php

namespace App\Modules\User\Application\DTOs;

class CreateUserRolDTO
{
    public function __construct(
        public readonly string $usuariId,
        public readonly string $rol,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            usuariId: $data['usuariId'],
            rol: $data['rol'],
        );
    }
}
