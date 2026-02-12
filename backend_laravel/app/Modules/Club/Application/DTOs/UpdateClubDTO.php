<?php

namespace App\Modules\Club\Application\DTOs;

class UpdateClubDTO
{
    public function __construct(
        public readonly ?string $nom = null,
        public readonly ?string $descripcio = null,
        public readonly ?string $adreca = null,
        public readonly ?string $ciutat = null,
        public readonly ?string $codiPostal = null,
        public readonly ?string $provincia = null,
        public readonly ?string $telefon = null,
        public readonly ?string $email = null,
        public readonly ?string $web = null,
        public readonly ?int $anyFundacio = null,
        public readonly ?string $creadorId = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'] ?? null,
            descripcio: $data['descripcio'] ?? null,
            adreca: $data['adreca'] ?? null,
            ciutat: $data['ciutat'] ?? null,
            codiPostal: $data['codiPostal'] ?? null,
            provincia: $data['provincia'] ?? null,
            telefon: $data['telefon'] ?? null,
            email: $data['email'] ?? null,
            web: $data['web'] ?? null,
            anyFundacio: isset($data['anyFundacio']) ? (int) $data['anyFundacio'] : null,
            creadorId: $data['creadorId'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
        );
    }
}
