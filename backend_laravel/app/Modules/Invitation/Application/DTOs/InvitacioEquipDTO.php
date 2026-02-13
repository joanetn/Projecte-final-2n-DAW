<?php

namespace App\Modules\Invitation\Application\DTOs;

use App\Modules\Invitation\Domain\Entities\InvitacioEquip;

class InvitacioEquipDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $equipId,
        public readonly string $usuariId,
        public readonly ?string $missatge = null,
        public readonly ?string $estat = null,
        public readonly bool $isActive = true,
        public readonly string $createdAt = '',
        public readonly string $updatedAt = '',
    ) {}

    public static function fromEntity(InvitacioEquip $invitacio): self
    {
        return new self(
            id: $invitacio->id,
            equipId: $invitacio->equipId,
            usuariId: $invitacio->usuariId,
            missatge: $invitacio->missatge,
            estat: $invitacio->estat,
            isActive: $invitacio->isActive,
            createdAt: $invitacio->createdAt ?? date('Y-m-d H:i:s'),
            updatedAt: $invitacio->updatedAt ?? date('Y-m-d H:i:s'),
        );
    }
}
