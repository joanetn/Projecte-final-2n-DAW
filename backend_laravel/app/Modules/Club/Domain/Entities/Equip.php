<?php

namespace App\Modules\Club\Domain\Entities;

class Equip
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly string $categoria,
        public readonly string $clubId,
        public readonly ?string $lligaId = null,
        public readonly bool $isActive = true,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
