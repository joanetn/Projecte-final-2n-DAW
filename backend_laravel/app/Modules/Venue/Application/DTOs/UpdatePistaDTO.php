<?php

namespace App\Modules\Venue\Application\DTOs;

class UpdatePistaDTO
{
    public function __construct(
        public readonly ?string $nom = null,
        public readonly ?string $tipus = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'] ?? null,
            tipus: $data['tipus'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
        );
    }
}
