<?php

namespace App\Modules\Club\Application\DTOs;

class UpdateEquipUsuariDTO
{
    public function __construct(
        public readonly ?string $rolEquip = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            rolEquip: $data['rolEquip'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
        );
    }
}
