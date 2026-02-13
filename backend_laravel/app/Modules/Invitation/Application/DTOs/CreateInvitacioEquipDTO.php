<?php

namespace App\Modules\Invitation\Application\DTOs;

class CreateInvitacioEquipDTO
{
    public function __construct(
        public readonly string $equipId,
        public readonly string $usuariId,
        public readonly ?string $missatge = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            equipId: $data['equipId'],
            usuariId: $data['usuariId'],
            missatge: $data['missatge'] ?? null,
        );
    }
}
