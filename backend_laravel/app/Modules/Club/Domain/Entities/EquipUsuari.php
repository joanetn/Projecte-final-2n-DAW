<?php

namespace App\Modules\Club\Domain\Entities;

class EquipUsuari
{
    public function __construct(
        public readonly string $id,
        public readonly string $equipId,
        public readonly string $usuariId,
        public readonly string $rolEquip,
        public readonly bool $isActive = true,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
