<?php

namespace App\Modules\Club\Application\DTOs;

class CreateEquipUsuariDTO
{
    public function __construct(
        public readonly string $equipId,
        public readonly string $usuariId,
        public readonly string $rolEquip,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            equipId: $data['equipId'],
            usuariId: $data['usuariId'],
            rolEquip: $data['rolEquip'],
        );
    }
}
