<?php
namespace App\Modules\Lineup\Application\DTOs;
class UpdateAlineacioDTO
{
    public function __construct(
        public readonly ?string $posicio = null,
        public readonly ?bool $isActive = null
    ) {}
    public static function fromArray(array $data): self
    {
        return new self(
            posicio: $data['posicio'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null
        );
    }
}
