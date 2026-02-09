<?php

namespace App\Modules\League\Application\DTOs;

class CreateRoundDTO
{
    public function __construct(
        public readonly string $nom,
        public readonly string $lligaId,
        public readonly string $dataInici,
        public readonly ?string $dataFi,
        public readonly string $status = 'PENDENT',
        public readonly bool $isActive = true,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'],
            lligaId: $data['lligaId'] ?? $data['lliga_id'],
            dataInici: $data['dataInici'],
            dataFi: $data['dataFi'] ?? null,
            status: $data['status'] ?? 'PENDENT',
            isActive: $data['isActive'] ?? true,
        );
    }
}
