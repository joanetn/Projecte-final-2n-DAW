<?php

namespace App\Modules\League\Application\DTOs;

class UpdateLeagueDTO
{
    public function __construct(
        public readonly ?string $nom = null,
        public readonly ?string $categoria = null,
        public readonly ?string $dataInici = null,
        public readonly ?string $dataFi = null,
        public readonly ?string $status = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'] ?? null,
            categoria: $data['categoria'] ?? null,
            dataInici: $data['data_inici'] ?? null,
            dataFi: $data['data_fi'] ?? null,
            status: $data['status'] ?? null,
            isActive: isset($data['is_active']) ? (bool) $data['is_active'] : null,
        );
    }
}
