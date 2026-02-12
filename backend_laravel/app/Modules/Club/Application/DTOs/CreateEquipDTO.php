<?php

namespace App\Modules\Club\Application\DTOs;

class CreateEquipDTO
{
    public function __construct(
        public readonly string $nom,
        public readonly string $categoria,
        public readonly string $clubId,
        public readonly ?string $lligaId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'],
            categoria: $data['categoria'],
            clubId: $data['clubId'],
            lligaId: $data['lligaId'] ?? null,
        );
    }
}
