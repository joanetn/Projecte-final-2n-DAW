<?php

namespace App\Modules\Club\Application\DTOs;

class UpdateEquipDTO
{
    public function __construct(
        public readonly ?string $nom = null,
        public readonly ?string $categoria = null,
        public readonly ?string $lligaId = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'] ?? null,
            categoria: $data['categoria'] ?? null,
            lligaId: $data['lligaId'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
        );
    }
}
