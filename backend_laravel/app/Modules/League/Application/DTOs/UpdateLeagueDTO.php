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
        public readonly ?string $logo_url = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'] ?? null,
            categoria: $data['categoria'] ?? null,
            dataInici: $data['dataInici'] ?? null,
            dataFi: $data['dataFi'] ?? null,
            status: $data['status'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
            logo_url: $data['logo_url'] ?? null,
        );
    }
}
