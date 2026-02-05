<?php

namespace App\Modules\League\Application\DTOs;

class CreateLeagueDTO
{
    public function __construct(
        public readonly string $nom,
        public readonly string $categoria,
        public readonly string $dataInici,
        public readonly string $status = 'NOT_STARTED',
        public readonly ?string $dataFi = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'],
            categoria: $data['categoria'],
            dataInici: $data['dataInici'],
            status: $data['status'] ?? 'NOT_STARTED',
            dataFi: $data['dataFi'] ?? null,
        );
    }
}
