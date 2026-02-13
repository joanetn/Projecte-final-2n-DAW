<?php

namespace App\Modules\Invitation\Application\DTOs;

class UpdateInvitacioEquipDTO
{
    public function __construct(
        public readonly ?string $missatge = null,
        public readonly ?string $estat = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            missatge: $data['missatge'] ?? null,
            estat: $data['estat'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
        );
    }
}
