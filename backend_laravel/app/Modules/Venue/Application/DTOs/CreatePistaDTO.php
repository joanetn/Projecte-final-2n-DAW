<?php

namespace App\Modules\Venue\Application\DTOs;

class CreatePistaDTO
{
    public function __construct(
        public readonly string $nom,
        public readonly string $instalacioId,
        public readonly ?string $tipus = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'],
            instalacioId: $data['instalacioId'],
            tipus: $data['tipus'] ?? null,
        );
    }
}
